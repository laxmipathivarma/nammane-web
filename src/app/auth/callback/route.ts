import { createServerSupabaseClient } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// This route sets the session cookie on its response, so Vercel must never
// treat that response as a cacheable/shared one -- a cached response is
// served to OTHER visitors too, and (to stop exactly that kind of leak)
// Vercel's edge silently strips Set-Cookie from anything it considers
// public/cacheable. Without this, GET handlers with no other dynamic
// signal default to that shared/cacheable mode: exchangeCodeForSession()
// below was succeeding every time (confirmed via Supabase's own auth
// logs and, temporarily, via a diagnostic that echoed the freshly-issued
// token back on the redirect URL) but the Set-Cookie header carrying it
// never survived to the browser, so the very next page load still saw
// the old session and the header stayed on "Sign in."
export const dynamic = 'force-dynamic'

// Google sign-in redirects the browser here with a `?code=...`
// after the person approves on the provider's own page. Exchanging it for
// a session has to happen server-side (it sets the auth cookies on the
// response), which is why this is a route handler rather than something
// the login page itself can do.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

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
