import { createServerSupabaseClient } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Google sign-in redirects the browser here with a `?code=...`
// after the person approves on the provider's own page. Exchanging it for
// a session has to happen server-side (it sets the auth cookies on the
// response), which is why this is a route handler rather than something
// the login page itself can do.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/discover'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('OAuth callback exchange failed', error)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth`)
}
