import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Session cookie is scoped to the shared parent domain (.nammane.in,
// matching src/lib/auth.ts's server client) wherever that's actually
// valid -- real nammane.in hosts only, never localhost or a Vercel
// preview URL, where the browser would just reject a `.nammane.in`
// Set-Cookie outright and break sign-in there. @supabase/ssr's own
// migration logic (see the long comment in auth.ts) handles clearing
// the old host-only cookie as sessions get created/refreshed here, the
// same as it does server-side.
function sharedCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const hostname = window.location.hostname
  return hostname === 'nammane.in' || hostname.endsWith('.nammane.in') ? '.nammane.in' : undefined
}

// This used to call createBrowserClient() fresh on every invocation.
// It's called from well over a dozen places (AuthProvider, the login
// and signup pages, profile/edit, discover, ...), and each call was
// spinning up its OWN independent GoTrueClient -- its own in-memory
// session state and its own background auto-refresh timer, all
// reading/writing the same cookie. That's exactly the "Invalid
// Refresh Token" race Supabase's own docs warn about with multiple
// client instances: AuthProvider's instance starts with whatever
// stale refresh token was already in the cookie, and while the login
// page's SEPARATE instance successfully signs in and writes a fresh
// session, AuthProvider's instance never hears that SIGNED_IN event
// (it happened on a different client object) -- then its own
// auto-refresh timer fires on the old token, gets a 400, and the
// header never updates even though the login genuinely succeeded.
// Memoizing a single shared instance here means the whole app has
// exactly one GoTrueClient, one set of listeners, and one refresh
// timer, so every sign-in is visible to every consumer immediately.
let client: SupabaseClient | undefined

export const createClient = () => {
  if (!client) {
    const domain = sharedCookieDomain()
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      domain ? { cookieOptions: { domain } } : undefined
    )
  }
  return client
}
