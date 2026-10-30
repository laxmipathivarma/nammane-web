import { createServerSupabaseClient, lastSetAllDiagnostic } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// This route sets the session cookie on its response, so it must never be
// treated as a cacheable/shared one -- a cached response is served to
// OTHER visitors too, and (to stop exactly that kind of leak) a CDN/edge
// layer will silently strip Set-Cookie from anything it considers
// public/cacheable. `dynamic = 'force-dynamic'` is the normal way to say
// that, but on this project's production environment specifically it
// wasn't enough on its own -- the response still came back
// `cache-control: public, max-age=0, must-revalidate` even after it was
// added (confirmed with curl against app.nammane.in directly), while the
// *identical* code produced the correct `no-store` on staging. Something
// at the production-environment level is overriding the inferred
// caching mode, so the header is now also set explicitly on every
// response this route returns -- that can't be silently overridden the
// way the inferred mode was. Before this, exchangeCodeForSession() below
// was succeeding on every single OAuth login (confirmed via Supabase's
// own auth logs, and via a temporary diagnostic that echoed the
// freshly-issued token back on the redirect URL) but the Set-Cookie
// carrying that fresh session never survived to the browser, so the very
// next page load still saw the old session and the header stayed on
// "Sign in."
export const dynamic = 'force-dynamic'

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

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
      const target = new URL(`${origin}${next}`)
      // TEMPORARY DIAGNOSTIC -- reports exactly what setAll() in
      // createServerSupabaseClient attempted (cookie names, value sizes,
      // and whether cookieStore.set() threw) so a swallowed error doesn't
      // stay invisible. Remove once the real bug is found and fixed.
      target.searchParams.set('nmdbg', Buffer.from(JSON.stringify(lastSetAllDiagnostic.attempts)).toString('base64'))
      return noStore(NextResponse.redirect(target))
    }
    console.error('OAuth callback exchange failed', error)
  }

  return noStore(NextResponse.redirect(`${origin}/auth/login?error=oauth`))
}
