import { createServerSupabaseClient } from '@/lib/auth'
import { startWhatsAppVerification } from '@/lib/twilioVerify'
import { sanitizeIndianMobileInput, toE164India } from '@/lib/phone'
import { NextRequest, NextResponse } from 'next/server'

// Starts a WhatsApp verification for a phone number someone is trying to
// add/change on their own profile. Doesn't touch `profiles` yet -- that
// only happens once /api/profile/phone/check confirms the code.
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const { phone } = await request.json()
  const digits = sanitizeIndianMobileInput(String(phone ?? ''))
  if (digits.length !== 10) {
    return NextResponse.json({ error: 'Enter a 10-digit mobile number.' }, { status: 400 })
  }

  try {
    await startWhatsAppVerification(toE164India(digits))
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'not_configured') {
      console.error('phone/send: Twilio env vars are not set')
      return NextResponse.json(
        { error: 'WhatsApp verification isn’t set up on this server yet.' },
        { status: 500 }
      )
    }
    const message = err instanceof Error ? err.message : 'Could not send the WhatsApp code'
    console.error('phone/send failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
