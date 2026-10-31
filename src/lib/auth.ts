import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

// Only the real nammane.in / app.nammane.in hosts get the shared-domain
// cookie -- a hardcoded `.nammane.in` would make the browser silently
// reject the Set-Cookie entirely on localhost or a Vercel preview URL
// (*.vercel.app isn't a subdomain of nammane.in), breaking sign-in there.
export function sharedCookieDomain(host: string): string | undefined {
  const hostname = host.split(':')[0]
  return hostname === 'nammane.in' || hostname.endsWith('.nammane.in') ? '.nammane.in' : undefined
}

// Session cookie is scoped to the shared parent domain (.nammane.in) so
// one sign-in is valid on both nammane.in and app.nammane.in -- needed
// for Home/the logo to cross from the app to the marketing site without
// it looking like a sign-out there (see Header.tsx).
//
// A previous attempt at exactly this was reverted (see git history /
// src/lib/supabase.ts's old comment) because changing a cookie's domain
// doesn't migrate an already-set cookie -- it creates a *second* cookie
// with the same name next to the old host-only one, and a browser
// sending both looks exactly like random logouts. That failure mode is
// real, but @supabase/ssr (confirmed in the installed version, 0.12.7)
// already has the actual fix for it built in: when `cookieOptions.domain`
// is set, both its setItem (sign-in/refresh) and removeItem (sign-out)
// paths explicitly clear the stale host-only cookie of the same name in
// the same response, specifically to prevent this exact bug (see
// node_modules/@supabase/ssr/dist/main/cookies.js, the "host-only
// also-clear" comments, referencing upstream issue #256). We just need
// to turn it on, not hand-roll the migration ourselves.
//
// One nuance: this only actively migrates a cookie the moment Supabase
// itself writes one (sign-in, sign-out, or a token refresh) -- someone
// already signed in under the old host-only cookie keeps using it,
// invisibly to nammane.in, until their session next refreshes (normally
// within the hour). That's a quiet delay, not a logout.
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  const host = (await headers()).get('host') ?? ''
  const domain = sharedCookieDomain(host)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(domain ? { cookieOptions: { domain } } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // The `options` Supabase passes here (maxAge, path, sameSite, and
        // crucially maxAge:0 when it wants to CLEAR a stale cookie) were
        // being dropped -- cookieStore.set(name, value) alone writes every
        // cookie as a default session cookie and never actually deletes
        // anything. That's what was silently breaking the post-OAuth
        // session: exchangeCodeForSession() succeeded server-side (the
        // user really was created/signed in -- see Supabase's own auth
        // logs), but the session cookie it tried to set never reliably
        // reached the browser with the right attributes, so the very next
        // page load found no session and rendered as signed-out --
        // bouncing the person back to the login screen even though their
        // account had already been created.
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component render (not a Route Handler
            // or Server Action) -- cookies() is read-only there, so this
            // only ever throws in a context where there was never going
            // to be a response to attach Set-Cookie headers to anyway.
          }
        },
      },
    }
  )
}
