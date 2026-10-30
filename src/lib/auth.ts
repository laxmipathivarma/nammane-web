import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

// Same reasoning as src/lib/supabase.ts's cookieDomain(): nammane.in and
// app.nammane.in are the same deployment but different cookie hosts, so
// a session cookie set on one is invisible on the other unless it's
// explicitly scoped to the shared parent domain. Mirrored here so a
// session created server-side (OAuth callback, OTP verify) is just as
// visible on both hosts as one created client-side.
async function cookieDomain(): Promise<string | undefined> {
  const h = (await headers()).get('host')?.split(':')[0] ?? ''
  return h === 'nammane.in' || h.endsWith('.nammane.in') ? '.nammane.in' : undefined
}

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  const domain = await cookieDomain()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { domain },
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
