import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { buildProfileUpsertPayload } from '@/lib/profileUpsert'
import { NextResponse } from 'next/server'

// Called once per sign-in (from AuthProvider's onAuthStateChange) so every
// auth method -- email/password, phone OTP, Google -- ends up
// with a real row in `profiles`, not just a Supabase Auth user. Reads the
// caller's own session server-side (so nobody can upsert a profile for a
// user that isn't them), then writes with the service-role client so it
// works regardless of what RLS policies exist on `profiles`.
export async function POST() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const admin = createAdminClient()

  // See src/lib/profileUpsert.ts (and its tests) for why this isn't built
  // inline anymore -- the '' vs null phone_number bug that used to live
  // here is exactly the kind of thing a unit test now guards against.
  const { error } = await admin
    .from('profiles')
    .upsert(buildProfileUpsertPayload(user), { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
    console.error('ensure-profile upsert failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
