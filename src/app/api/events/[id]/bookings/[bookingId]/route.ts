import { createServerSupabaseClient } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Host approves or rejects one guest's join request. RLS (database/006_
// bookings_policies.sql) already restricts the UPDATE to the event's own
// host, so the explicit host_id check here is belt-and-suspenders, same
// pattern as /api/events/[id]/poker.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; bookingId: string } }
) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: event } = await supabase.from('events').select('id,host_id').eq('id', params.id).maybeSingle()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.host_id !== user.id) {
    return NextResponse.json({ error: 'Only the host can approve or reject guests' }, { status: 403 })
  }

  const body = await req.json()
  const status = body.status as string
  if (status !== 'approved' && status !== 'rejected') {
    return NextResponse.json({ error: "status must be 'approved' or 'rejected'" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', params.bookingId)
    .eq('event_id', params.id)
    .select('id,guest_id,status,requested_at,decided_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ booking: data })
}
