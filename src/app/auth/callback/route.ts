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
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // TEMPORARY DIAGNOSTIC -- remove once the "login succeeds but cookie
      // never lands in the browser" bug is confirmed fixed. Appends
      // (non-sensitive) proof that the server really did get a fresh
      // session, so a stale cookie after redirect means the Set-Cookie
      // itself isn't surviving, not that the exchange silently failed. A
      // query param survives the redirect (a header on this hop wouldn't
      // be visible on the final response after the browser follows it).
      const dbg = Buffer.from(
        JSON.stringify({
          hasSession: !!data.session,
          userId: data.session?.user?.id ?? null,
          accessTokenIat: data.session?.access_token
            ? JSON.parse(atob(data.session.access_token.split('.')[1])).iat
            : null,
        })
      ).toString('base64')
      const target = new URL(`${origin}${next}`)
      target.searchParams.set('nmdbg', dbg)
      return NextResponse.redirect(target)
    }
    console.error('OAuth callback exchange failed', error)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth`)
}
