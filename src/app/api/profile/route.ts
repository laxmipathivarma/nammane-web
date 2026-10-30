import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { validateGovtId, type GovtIdType } from '@/lib/govtId'
import { MAX_INTERESTS } from '@/lib/interests'
import { avatarByKey } from '@/lib/avatars'
import { isMinorDob } from '@/lib/age'
import { profileCompletionBreakdown } from '@/lib/profileCompletion'
import { NextRequest, NextResponse } from 'next/server'

type Stats = {
  eventsHosted: number
  hostRating: number | null
  reviewCount: number
  repeatGuestPct: number | null
}

type RecentReview = {
  rating: number
  comment: string | null
  createdAt: string
  reviewerName: string
  reviewerInitial: string
} | null

// The profile view page used to show the same "12 events / 4.9 rating /
// 68% repeat guests" and a fixed "Aisha J." review for every account,
// signed-in or not. Real numbers, computed here from the actual
// events/bookings/reviews tables, scoped to this signed-in user's own id
// (never anything client-supplied).
//
// Uses the admin (service-role) client, not the session-scoped one GET
// otherwise uses for the profile row itself: `bookings` has row-level
// security turned on but no SELECT policy defined yet (events/profiles
// do, bookings doesn't -- see database/001_initial_schema.sql), so the
// session-scoped client silently gets zero rows back for it. Each query
// is wrapped so a schema hiccup degrades to an honest empty/zero state
// instead of taking the whole profile page down.
async function loadStats(userId: string): Promise<{ stats: Stats; recentReview: RecentReview }> {
  const admin = createAdminClient()
  const stats: Stats = { eventsHosted: 0, hostRating: null, reviewCount: 0, repeatGuestPct: null }
  let recentReview: RecentReview = null

  try {
    const { count } = await admin
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('host_id', userId)
      .eq('status', 'published')
    stats.eventsHosted = count ?? 0
  } catch (e) {
    console.error('profile stats: events count failed', e)
  }

  try {
    const { data: reviewRows } = await admin
      .from('reviews')
      .select('rating, comment, created_at, reviewer_id')
      .eq('reviewed_id', userId)
      .order('created_at', { ascending: false })

    if (reviewRows && reviewRows.length > 0) {
      stats.reviewCount = reviewRows.length
      const total = reviewRows.reduce((sum, r) => sum + (r.rating ?? 0), 0)
      stats.hostRating = Math.round((total / reviewRows.length) * 10) / 10

      const latest = reviewRows[0]
      const { data: reviewer } = await admin
        .from('profiles')
        .select('display_name, email')
        .eq('id', latest.reviewer_id)
        .maybeSingle()
      const reviewerName = reviewer?.display_name || reviewer?.email?.split('@')[0] || 'A guest'
      recentReview = {
        rating: latest.rating ?? 0,
        comment: latest.comment,
        createdAt: latest.created_at,
        reviewerName,
        reviewerInitial: reviewerName.charAt(0).toUpperCase(),
      }
    }
  } catch (e) {
    console.error('profile stats: reviews failed', e)
  }

  try {
    const { data: hostEvents } = await admin.from('events').select('id').eq('host_id', userId)
    const eventIds = (hostEvents ?? []).map((e) => e.id)
    if (eventIds.length > 0) {
      const { data: bookingRows } = await admin
        .from('bookings')
        .select('guest_id, event_id')
        .in('event_id', eventIds)
        .in('status', ['approved', 'attended'])
      if (bookingRows && bookingRows.length > 0) {
        const perGuest = new Map<string, Set<string>>()
        for (const b of bookingRows) {
          const set = perGuest.get(b.guest_id) ?? new Set<string>()
          set.add(b.event_id)
          perGuest.set(b.guest_id, set)
        }
        const totalGuests = perGuest.size
        const repeatGuests = [...perGuest.values()].filter((s) => s.size > 1).length
        stats.repeatGuestPct = totalGuests > 0 ? Math.round((repeatGuests / totalGuests) * 100) : null
      }
    }
  } catch (e) {
    console.error('profile stats: repeat guests failed', e)
  }

  return { stats, recentReview }
}

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

  const { stats, recentReview } = await loadStats(user.id)
  const completion = profileCompletionBreakdown(data)

  return NextResponse.json({ profile: data, stats, recentReview, completion })
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
