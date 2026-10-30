import { createServerSupabaseClient } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Creates a published event for the signed-in host. Uses the user's own
// session (not the service-role admin client) so the `events_host_id`
// RLS policies (added in database/002_public_private_radius.sql) are the
// actual gate -- a signed-out or mismatched request is rejected by
// Postgres itself, not just by this route's own checks.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      category,
      description,
      starts_at,
      city,
      address,
      capacity,
      contribution_amount,
      is_public,
      radius_km,
      lat,
      lng,
    } = body

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 })
    }

    const publicEvent = is_public !== false
    if (publicEvent && (typeof radius_km !== 'number' || radius_km < 1 || radius_km > 100)) {
      return NextResponse.json(
        { error: 'Public events need a radius between 1 and 100 km' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        host_id: user.id,
        title,
        category,
        description: description || null,
        starts_at: starts_at || null,
        city: city || null,
        address: address || null,
        capacity: capacity ? Number(capacity) : null,
        contribution_amount: contribution_amount ? Number(contribution_amount) : null,
        contribution_type: contribution_amount ? 'paid' : 'free',
        is_public: publicEvent,
        radius_km: publicEvent ? radius_km : null,
        lat: typeof lat === 'number' ? lat : null,
        lng: typeof lng === 'number' ? lng : null,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('event insert failed', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ event: data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
