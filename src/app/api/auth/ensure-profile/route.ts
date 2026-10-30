import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
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

  // Supabase's `user.phone` is '' (not null/undefined) for anyone who
  // didn't sign in by phone -- `?? null` only catches null/undefined, so
  // every email/Google sign-in was writing phone_number: '' here. profiles
  // has a UNIQUE constraint on phone_number, so only the very first such
  // user could ever upsert successfully; every other email/Google sign-in
  // hit "duplicate key value violates unique constraint" (Postgres code
  // 23505) and this whole call silently 500'd (confirmed in Vercel's
  // runtime logs -- every single ensure-profile call was failing this
  // way). `|| null` treats '' the same as null/undefined.
  const { error } = await admin.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      phone_number: user.phone || null,
      phone_verified: Boolean(user.phone),
      display_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: false }
  )

  if (error) {
    console.error('ensure-profile upsert failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
