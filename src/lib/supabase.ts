import { createBrowserClient } from '@supabase/ssr'

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
export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
