import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// This route sets the session cookie on its response, so it must never be
// treated as a cacheable/shared one -- a cached response is served to
// OTHER visitors too, and (to stop exactly that kind of leak) a CDN/edge
// layer will silently strip Set-Cookie from anything it considers
// public/cacheable.
export const dynamic = 'force-dynamic'

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

// Matches src/lib/auth.ts's sharedCookieDomain -- real nammane.in hosts
// only, never localhost or a Vercel preview URL. This is the single most
// important place to get this right: a brand-new sign-in lands here, so
// setting the shared-domain cookie from the very first moment (instead of
// waiting on a later token refresh) is what makes "just signed in with
// Google" immediately visible on nammane.in too.
function sharedCookieDomain(hostname: string): string | undefined {
  return hostname === 'nammane.in' || hostname.endsWith('.nammane.in') ? '.nammane.in' : undefined
}

// Google sign-in redirects the browser here with a `?code=...`
// after the person approves on the provider's own page. Exchanging it for
// a session has to happen server-side (it sets the auth cookies on the
// response), which is why this is a route handler rather than something
// the login page itself can do.
//
// This deliberately does NOT use src/lib/auth.ts's createServerSupabaseClient
// (which wires cookies through next/headers' cookies()). On this route that
// reliably failed in a way that was invisible until instrumented: setAll()
// never threw, and Supabase's own auth logs showed the exchange succeeding
// every time, but the session cookie it tried to write (chunked into
// sb-...-auth-token.0 / .1 once the Google provider_token pushed it over
// Supabase's single-cookie size limit) never actually reached the browser --
// confirmed by echoing exactly what setAll() attempted back on the redirect
// URL, and by checking the browser's own cookie jar immediately after. A
// plain cookie set directly on the NextResponse object this handler
// constructs and returns, by contrast, landed every time. So here, cookies
// are read straight off the incoming request and written straight onto the
// exact response object being returned -- the pattern Supabase's own docs
// use for this exact route -- rather than trusting next/headers to wire
// itself into a response built inside an awaited helper function.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)
    const domain = sharedCookieDomain(new URL(request.url).hostname)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        ...(domain ? { cookieOptions: { domain } } : {}),
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return noStore(response)
    }
    console.error('OAuth callback exchange failed', error)
  }

  return noStore(NextResponse.redirect(`${origin}/auth/login?error=oauth`))
}
