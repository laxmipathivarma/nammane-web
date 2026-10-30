import { createServerSupabaseClient } from '@/lib/auth'
import { emptyLedger, emptyPokerEventData, emptyTable, type PokerEventData } from '@/lib/pokerLedger'
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

// Older events saved a single flat ledger (`{currency, players, rake,
// expenses, settle, invitees}`) before "multiple tables" existed. Wrap one
// of those into a single-table PokerEventData instead of discarding it, so
// a host who was mid-game when this shipped doesn't lose their table.
function migrate(raw: unknown): PokerEventData {
  if (!raw || typeof raw !== 'object') return emptyPokerEventData()
  const obj = raw as Record<string, unknown>
  if (Array.isArray(obj.tables)) {
    // Already the current shape -- still spread over the empty shape so a
    // save from before `invitationMessage` existed comes back valid.
    return { ...emptyPokerEventData(), ...obj } as PokerEventData
  }
  if (Array.isArray(obj.players)) {
    const table = emptyTable('Table 1')
    table.ledger = { ...emptyLedger(), ...obj, players: obj.players as PokerEventData['tables'][number]['ledger']['players'] }
    const allOut = table.ledger.players.length > 0 && table.ledger.players.every((p) => p.out != null)
    table.status = allOut ? 'settled' : 'running'
    return { invitees: Array.isArray(obj.invitees) ? (obj.invitees as PokerEventData['invitees']) : [], tables: [table] }
  }
  return emptyPokerEventData()
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

  const data: PokerEventData = migrate(event.event_details && event.event_details.poker)
  const eventInfo = {
    title: event.title as string,
    address: event.address as string | null,
    startsAt: event.starts_at as string | null,
    lat: event.lat as number | null,
    lng: event.lng as number | null,
  }
  return NextResponse.json({ data, event: eventInfo })
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
  const data: PokerEventData = body.data
  if (!data || !Array.isArray(data.tables) || !Array.isArray(data.invitees)) {
    return NextResponse.json({ error: 'Malformed poker data payload' }, { status: 400 })
  }

  const nextDetails = { ...(event.event_details || {}), poker: data }
  const { error } = await supabase.from('events').update({ event_details: nextDetails }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
