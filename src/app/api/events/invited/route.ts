import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { waDigits } from '@/lib/invite'
import { NextResponse } from 'next/server'

// "My Invitations" on Discover -- events where the signed-in user's own
// phone number shows up in a poker event's guest list. There's no
// account-linked RSVP system (invites go out as plain WhatsApp links to a
// phone number, not to a Nammane user id), so this is the only way to
// answer "what am I invited to": match the viewer's own stored phone
// against every poker event's invitees. Uses the admin client because
// RLS rightly hides other hosts' events from a normal client -- this
// route is the explicit, narrow exception, and it only ever returns an
// event when the invitee-phone match already proves the viewer belongs
// on that guest list.
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('phone_number').eq('id', user.id).maybeSingle()
  const myPhone = profile?.phone_number ? waDigits(profile.phone_number) : null
  if (!myPhone) return NextResponse.json({ events: [], reason: 'no_phone' })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('events')
    .select('id,host_id,title,category,description,is_public,capacity,address,city,starts_at,event_details')
    .eq('status', 'published')
    .eq('category', 'poker')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const mine = (data ?? []).filter((e) => {
    if (e.host_id === user.id) return false // "my invitations" means someone else's event
    const invitees = e.event_details?.poker?.invitees as { phone?: string }[] | undefined
    return Array.isArray(invitees) && invitees.some((i) => i.phone && waDigits(i.phone) === myPhone)
  })

  const events = mine.map((e) => ({
    id: e.id,
    host_id: e.host_id,
    title: e.title,
    category: e.category,
    description: e.description,
    is_public: e.is_public,
    capacity: e.capacity,
    address: e.address,
    city: e.city,
    starts_at: e.starts_at,
  }))

  return NextResponse.json({ events })
}
