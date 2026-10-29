import { createServerSupabaseClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: name ? { data: { full_name: name } } : undefined,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Service-role upsert, same as /api/auth/ensure-profile -- `insert`
      // here would fail on a retried signup (duplicate id) and its result
      // was never even checked, so a failed write was invisible.
      const admin = createAdminClient()
      const { error: profileError } = await admin.from('profiles').upsert(
        {
          id: data.user.id,
          email: data.user.email,
          display_name: name || null,
        },
        { onConflict: 'id' }
      )
      if (profileError) console.error('signup profile upsert failed', profileError)
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
