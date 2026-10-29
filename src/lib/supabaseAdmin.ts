import { createClient } from '@supabase/supabase-js'

// Server-only client using the service-role key -- bypasses RLS so routes
// like /api/auth/ensure-profile can upsert a profile row for whichever
// user the request's own session proves is signed in, regardless of what
// row-level-security policies exist on `profiles`. Never import this from
// a client component; the service role key must never reach the browser.
export const createAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
