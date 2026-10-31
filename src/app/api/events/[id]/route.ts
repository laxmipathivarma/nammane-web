import { createServerSupabaseClient } from '@/lib/auth'
import { isEventCompleted } from '@/lib/eventStatus'
import { NextRequest, NextResponse } from 'next/server'

// Backs the host "Edit event" flow: GET to prefill the form with the
// event's current values, PATCH to save changes. Both are host-scoped --
// a signed-in user can only read or write an event where host_id matches
// their own id, same as the "Hosts can update their own events" RLS
// policy (002_public_private_radius.sql), which still applies underneath
// this since it runs on the user's own session, not an admin client.
//
// Editing is only allowed before the event's starts_at has passed -- once
// an event is over there's nothing left to change, and a host silently
// editing the record of what already happened (the venue, the price,
// whether it ever required approval) isn't something guests who attended
// should have to trust. isEventCompleted is the single source of truth
// for that cutoff, shared with the "Event completed" badges in the UI.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('events')
    .select('id,title,category,description,starts_at,address,capacity,contribution_amount,is_public,radius_km,lat,lng,host_id')
    .eq('id', params.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data || data.host_id !== user.id) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json({ event: data, completed: isEventCompleted(data.starts_at) })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

    // Look the event up first (not just trusting the id in the URL) so we
    // can check both ownership and whether it's already happened before
    // touching anything.
    const { data: existing, error: fetchError } = await supabase
      .from('events')
      .select('id,host_id,starts_at')
      .eq('id', params.id)
      .maybeSingle()

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 })
    if (!existing || existing.host_id !== user.id) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (isEventCompleted(existing.starts_at)) {
      return NextResponse.json(
        { error: 'This event has already happened, so it can no longer be edited.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      category,
      description,
      starts_at,
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

    // A host can change starts_at itself as part of this edit (e.g. move
    // the night by a day) -- re-check completion against the *new* value
    // too, so an edit can't be used to "un-complete" an event by first
    // saving it with a future date then... no, simpler: just block moving
    // it to a point already in the past, same rule a fresh create enforces
    // implicitly by only ever defaulting to blank/future dates.
    if (isEventCompleted(starts_at)) {
      return NextResponse.json({ error: 'Pick a date and time that hasn’t passed yet.' }, { status: 400 })
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
      .update({
        title,
        category,
        description: description || null,
        starts_at: starts_at || null,
        address: address || null,
        capacity: capacity ? Number(capacity) : null,
        contribution_amount: contribution_amount ? Number(contribution_amount) : null,
        contribution_type: contribution_amount ? 'paid' : 'free',
        is_public: publicEvent,
        radius_km: publicEvent ? radius_km : null,
        lat: typeof lat === 'number' ? lat : null,
        lng: typeof lng === 'number' ? lng : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('host_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('event update failed', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ event: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
