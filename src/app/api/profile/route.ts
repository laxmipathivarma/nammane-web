import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { validateGovtId, type GovtIdType } from '@/lib/govtId'
import { MAX_INTERESTS } from '@/lib/interests'
import { avatarByKey } from '@/lib/avatars'
import { isMinorDob } from '@/lib/age'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (error) {
    console.error('profile GET failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}

// Everything on the edit form, validated server-side too (not just in the
// form) since this is a real write to someone's trust/verification data.
// phone_number/phone_verified are deliberately NOT accepted here -- those
// only ever change through the WhatsApp verify flow
// (/api/profile/phone/check), so a person can't just type in a new number
// and have it marked verified without actually verifying it.
export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const body = await request.json()
  const update: Record<string, unknown> = {}

  if (typeof body.display_name === 'string') {
    const name = body.display_name.trim()
    if (!name) return NextResponse.json({ error: 'Name can’t be empty.' }, { status: 400 })
    update.display_name = name
  }

  if (typeof body.bio === 'string') {
    update.bio = body.bio.trim().slice(0, 300)
  }

  if (typeof body.city === 'string') {
    update.city = body.city.trim().slice(0, 80) || null
  }

  if (body.avatar_key !== undefined) {
    if (body.avatar_key !== null && !avatarByKey(body.avatar_key)) {
      return NextResponse.json({ error: 'That avatar doesn’t exist.' }, { status: 400 })
    }
    update.avatar_key = body.avatar_key
  }

  if (Array.isArray(body.interests)) {
    const interests = body.interests
      .filter((i: unknown): i is string => typeof i === 'string' && i.trim().length > 0)
      .map((i: string) => i.trim().slice(0, 40))
    if (interests.length > MAX_INTERESTS) {
      return NextResponse.json({ error: `Pick at most ${MAX_INTERESTS} interests.` }, { status: 400 })
    }
    update.interests = interests
  }

  if (body.date_of_birth !== undefined) {
    if (body.date_of_birth === null || body.date_of_birth === '') {
      update.date_of_birth = null
    } else {
      const dob = String(body.date_of_birth)
      if (Number.isNaN(Date.parse(dob))) {
        return NextResponse.json({ error: 'That date of birth doesn’t look right.' }, { status: 400 })
      }
      update.date_of_birth = dob
      // Under-18 -- hold the profile as pending instead of silently
      // treating it as a normal active one. See
      // profiles.profile_status in database/004_profile_fields.sql.
      update.profile_status = isMinorDob(dob) ? 'pending_age_review' : 'active'
    }
  }

  if (body.govt_id_type !== undefined || body.govt_id_number !== undefined) {
    const type = body.govt_id_type as GovtIdType | null
    const rawNumber = body.govt_id_number as string | null
    if (type === null || !rawNumber) {
      update.govt_id_type = null
      update.govt_id_number = null
      update.govt_id_verified = false
    } else {
      const result = validateGovtId(type, rawNumber)
      if (!result.valid) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      update.govt_id_type = type
      update.govt_id_number = result.value
      // A changed ID always resets to unverified -- see
      // profiles.govt_id_verified's comment (self-declared, nothing
      // checks it against a real registry yet).
      update.govt_id_verified = false
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }

  // Service-role write (same pattern as /api/auth/ensure-profile) so this
  // works regardless of the profiles RLS policy shape, scoped to the
  // caller's own id from their session -- never a client-supplied id.
  const admin = createAdminClient()
  const { data, error } = await admin.from('profiles').update(update).eq('id', user.id).select().maybeSingle()

  if (error) {
    console.error('profile PUT failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}
