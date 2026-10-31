import { describe, it, expect } from 'vitest'
import { sharedCookieDomain } from './auth'

// Regression coverage for the session-cookie-domain gate. Getting this
// wrong in either direction is a real outage: too narrow and Home
// crossing hosts looks like a logout again (the original bug); too broad
// and a hardcoded `.nammane.in` on localhost or a Vercel preview URL
// makes the browser silently reject the Set-Cookie outright, breaking
// sign-in there entirely.
describe('sharedCookieDomain', () => {
  it.each(['nammane.in', 'app.nammane.in', 'www.nammane.in', 'poker.nammane.in'])(
    'shares the cookie on the real domain and its subdomains (%s)',
    (host) => {
      expect(sharedCookieDomain(host)).toBe('.nammane.in')
    }
  )

  it('keeps working with an explicit port on a real host', () => {
    expect(sharedCookieDomain('app.nammane.in:3000')).toBe('.nammane.in')
  })

  it.each(['localhost', 'localhost:3000', '127.0.0.1', 'my-app-git-main.vercel.app', 'evilnammane.in'])(
    'never shares the cookie off the real domain (%s)',
    (host) => {
      expect(sharedCookieDomain(host)).toBeUndefined()
    }
  )
})
