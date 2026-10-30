import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { checkWhatsAppVerification } from '@/lib/twilioVerify'
import { sanitizeIndianMobileInput, toE164India } from '@/lib/phone'
import { NextRequest, NextResponse } from 'next/server'

// Confirms the code Twilio sent over WhatsApp, and only on success writes
// the verified number onto the caller's own profile row (service-role
// write, same pattern as /api/auth/ensure-profile, but scoped to the id
// from this request's own session so nobody can verify a number onto
// someone else's profile).
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const { phone, code } = await request.json()
  const digits = sanitizeIndianMobileInput(String(phone ?? ''))
  const otp = String(code ?? '').replace(/\D/g, '')
  if (digits.length !== 10) {
    return NextResponse.json({ error: 'Enter a 10-digit mobile number.' }, { status: 400 })
  }
  if (!otp) {
    return NextResponse.json({ error: 'Enter the code.' }, { status: 400 })
  }

  try {
    const e164 = toE164India(digits)
    const approved = await checkWhatsAppVerification(e164, otp)
    if (!approved) {
      return NextResponse.json({ error: 'That code is incorrect or has expired.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ phone_number: e164, phone_verified: true })
      .eq('id', user.id)

    if (error) {
      console.error('phone/check: profile update failed', error)
      return NextResponse.json({ error: 'Verified, but saving it failed. Try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'not_configured') {
      console.error('phone/check: Twilio env vars are not set')
      return NextResponse.json(
        { error: 'WhatsApp verification isn’t set up on this server yet.' },
        { status: 500 }
      )
    }
    const message = err instanceof Error ? err.message : 'Could not check the code'
    console.error('phone/check failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
