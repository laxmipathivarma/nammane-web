import { createServerSupabaseClient } from '@/lib/auth'
import { emptyLedger, type PokerLedger } from '@/lib/pokerLedger'
import { NextRequest, NextResponse } from 'next/server'

// The poker ledger for a single event lives in `events.event_details`
// (JSONB, already on the table from 001_initial_schema.sql) under the
// `poker` key -- no separate table needed. Only the host can read or
// write it; RLS on `events` (database/002_public_private_radius.sql)
// already restricts UPDATE to the host, so this route just needs to
// confirm the event is actually a poker event before touching it.

async function loadEvent(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, id: string) {
  const { data } = await supabase
    .from('events')
    .select('id,host_id,category,event_details,title,address,starts_at,lat,lng')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const event = await loadEvent(supabase, params.id)
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.host_id !== user.id) return NextResponse.json({ error: 'Only the host can open the ledger' }, { status: 403 })
  if (event.category !== 'poker') return NextResponse.json({ error: 'Not a poker event' }, { status: 400 })

  // Spread over emptyLedger() so a ledger saved before the invite list
  // existed (or before any other future field) still comes back with a
  // valid shape instead of `invitees` being undefined on the client.
  const ledger: PokerLedger = { ...emptyLedger(), ...((event.event_details && event.event_details.poker) || {}) }
  const eventInfo = {
    title: event.title as string,
    address: event.address as string | null,
    startsAt: event.starts_at as string | null,
    lat: event.lat as number | null,
    lng: event.lng as number | null,
  }
  return NextResponse.json({ ledger, event: eventInfo })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const event = await loadEvent(supabase, params.id)
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.host_id !== user.id) return NextResponse.json({ error: 'Only the host can edit the ledger' }, { status: 403 })

  const body = await req.json()
  const ledger: PokerLedger = body.ledger
  if (!ledger || !Array.isArray(ledger.players) || (ledger.invitees && !Array.isArray(ledger.invitees))) {
    return NextResponse.json({ error: 'Malformed ledger payload' }, { status: 400 })
  }

  const nextDetails = { ...(event.event_details || {}), poker: { ...ledger, invitees: ledger.invitees || [] } }
  const { error } = await supabase.from('events').update({ event_details: nextDetails }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
