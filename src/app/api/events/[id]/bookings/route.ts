import { createServerSupabaseClient } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Guest join requests for one event, backed by the `bookings` table that's
// been in the schema since 001_initial_schema.sql but never had anything
// behind it -- "Request to join" on the event detail page used to be a
// plain <button> with no onClick at all. RLS (database/006_bookings_
// policies.sql) is the real gate here: a guest can only insert/see their
// own row, a host can only see/update rows on events they host.
//
// GET branches on who's asking, since the event detail page needs two
// different things from the same endpoint:
//  - the host sees every request, to approve/reject
//  - a guest sees only their own request's status, to render the right
//    button state (Request to join / Pending / You're in / Declined)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: event } = await supabase.from('events').select('id,host_id').eq('id', params.id).maybeSingle()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (event.host_id === user.id) {
    const { data, error } = await supabase
      .from('bookings')
      .select('id,guest_id,status,guest_count,requested_at,decided_at,profiles(display_name,avatar_url)')
      .eq('event_id', params.id)
      .order('requested_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ role: 'host', bookings: data ?? [] })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('id,status,requested_at,decided_at')
    .eq('event_id', params.id)
    .eq('guest_id', user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ role: 'guest', booking: data ?? null })
}

// A guest requesting to join. Rejects a host requesting their own event
// (nothing to approve there -- see event.isHost on the detail page) and a
// request against an event that's already happened, since there's no
// reason to let someone queue up for a night that's over.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: event } = await supabase.from('events').select('id,host_id,starts_at').eq('id', params.id).maybeSingle()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.host_id === user.id) {
    return NextResponse.json({ error: "You're hosting this one -- nothing to request." }, { status: 400 })
  }
  if (event.starts_at && new Date(event.starts_at) < new Date()) {
    return NextResponse.json({ error: 'This event has already happened.' }, { status: 400 })
  }

  // Already requested (or decided) -- the UNIQUE(event_id, guest_id)
  // constraint would reject a second insert anyway, so just hand back the
  // existing row instead of surfacing a raw DB conflict error.
  const { data: existing } = await supabase
    .from('bookings')
    .select('id,status,requested_at,decided_at')
    .eq('event_id', params.id)
    .eq('guest_id', user.id)
    .maybeSingle()
  if (existing) return NextResponse.json({ role: 'guest', booking: existing })

  const { data, error } = await supabase
    .from('bookings')
    .insert({ event_id: params.id, guest_id: user.id, status: 'requested' })
    .select('id,status,requested_at,decided_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ role: 'guest', booking: data }, { status: 201 })
}
