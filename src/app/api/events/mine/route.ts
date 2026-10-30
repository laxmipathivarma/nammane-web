import { createServerSupabaseClient } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Every event the signed-in user has hosted, newest first -- this is what
// backs the /host dashboard so a host can always get back to an event's
// tools (poker or otherwise) without having to remember its URL. RLS on
// `events` already scopes SELECT, but we also filter by host_id explicitly
// so this never depends on RLS alone.
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('events')
    .select('id,title,category,starts_at,is_public,status,created_at')
    .eq('host_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ events: data ?? [] })
}
