import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Deliberately back to the default host-only session cookie. A
// previous attempt scoped this to the shared parent domain
// (.nammane.in) so one sign-in would be valid on both nammane.in and
// app.nammane.in -- but changing a cookie's domain attribute doesn't
// migrate an already-set cookie, it creates a *second* cookie with
// the same name next to the old one, and a browser sending both on
// every request is exactly the kind of thing that looks like random
// logouts. The real fix for "the logo logs me out" is Header.tsx's
// logo never crossing hosts in the first place (see its own
// comment) -- so there's no cookie-sharing problem left to solve
// here, and the safer, standard default is to leave it alone.
//
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
    client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return client
}
