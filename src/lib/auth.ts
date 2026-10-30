import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

// TEMPORARY DIAGNOSTIC -- setAll's catch below silently swallows whatever
// cookieStore.set() throws, on the assumption it only ever fires when
// called from a Server Component render. This records what actually
// happened on the most recent call (name + value length attempted, and
// the error if one was thrown) so a Route Handler can report it instead
// of guessing. Remove once the real "session cookie never lands" bug is
// found and fixed.
export const lastSetAllDiagnostic: {
  attempts: { name: string; valueLength: number; threw: string | null }[]
} = { attempts: [] }

// Deliberately back to the default host-only session cookie -- see
// the matching comment in src/lib/supabase.ts for why. The actual
// fix for "clicking the logo logs me out" is the shared Header's
// logo never crossing from app.nammane.in to nammane.in (or back) in
// the first place, so there's no cross-host cookie to share here.
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
          lastSetAllDiagnostic.attempts = []
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
              lastSetAllDiagnostic.attempts.push({ name, valueLength: value.length, threw: null })
            } catch (err) {
              // Called from a Server Component render (not a Route Handler
              // or Server Action) -- cookies() is read-only there, so this
              // only ever throws in a context where there was never going
              // to be a response to attach Set-Cookie headers to anyway.
              // TEMPORARY: recording what actually threw, see diagnostic above.
              lastSetAllDiagnostic.attempts.push({
                name,
                valueLength: value.length,
                threw: err instanceof Error ? err.message : String(err),
              })
            }
          })
        },
      },
    }
  )
}
