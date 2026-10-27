import { NextRequest, NextResponse } from 'next/server'

// Marketing domains (nammane.in / www.nammane.in) are served from the
// /marketing route group inside this same app. Everything else (app.nammane.in,
// localhost, Vercel preview URLs) keeps using the regular app routes.
const MARKETING_HOSTS = ['nammane.in', 'www.nammane.in']

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0] ?? ''
  const { pathname } = request.nextUrl

  if (MARKETING_HOSTS.includes(hostname) && !pathname.startsWith('/marketing')) {
    const url = request.nextUrl.clone()
    url.pathname = `/marketing${pathname === '/' ? '' : pathname}`

    // usePathname() on the client reflects the ORIGINAL request URL, not the
    // rewritten one -- a rewrite is invisible to client components. So
    // SiteChrome can't detect "we're on a marketing route" from pathname
    // alone when the request got here via this host-based rewrite. Flag it
    // via a request header instead, read server-side in the root layout.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nm-marketing', '1')

    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
