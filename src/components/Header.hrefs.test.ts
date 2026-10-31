import { describe, it, expect } from 'vitest'
import { hrefsFor } from './Header'

// Regression coverage for Home/logo navigation. Home and the logo always
// use hrefsFor(...).home:
//  - on the marketing site, Home stays on nammane.in (relative "/")
//  - inside the webapp, Home ALWAYS stays in the app (relative "/"),
//    signed in or out. This was briefly made to cross to the marketing
//    site instead, then reverted the same day: a different host doesn't
//    share the app's session cookie, so the marketing page's header
//    shows "Sign in / Sign up" no matter what -- there is no version of
//    crossing hosts that doesn't look like getting signed out. Don't
//    change this back without building real cross-domain session
//    sharing first.
describe('Header hrefsFor', () => {
  it.each([
    [true, true],
    [true, false],
  ])('on the marketing site, home stays the relative path "/" (signedIn=%s)', (isMarketing, signedIn) => {
    const hrefs = hrefsFor(isMarketing, signedIn)
    expect(hrefs.home).toBe('/')
  })

  it('inside the webapp while signed out, home stays in the app (not the marketing site)', () => {
    const hrefs = hrefsFor(false, false)
    expect(hrefs.home).toBe('/')
  })

  it('inside the webapp while signed in, home stays in the app', () => {
    const hrefs = hrefsFor(false, true)
    expect(hrefs.home).toBe('/')
  })

  it('on the webapp while signed in, every nav link is a relative in-app route', () => {
    const hrefs = hrefsFor(false, true)
    for (const href of Object.values(hrefs)) {
      if (href === 'https://nammane.in/mobile-app') continue // intentionally cross-host
      expect(href.startsWith('http')).toBe(false)
    }
  })

  it('on the webapp while signed out, every nav link except Mobile App is a relative in-app route', () => {
    const hrefs = hrefsFor(false, false)
    for (const href of Object.values(hrefs)) {
      if (href === 'https://nammane.in/mobile-app') continue // intentionally cross-host
      expect(href.startsWith('http')).toBe(false)
    }
  })

  it('on the marketing site while signed out, Host/Join/Discover gate through login', () => {
    const hrefs = hrefsFor(true, false)
    expect(hrefs.host).toBe('https://app.nammane.in/auth/login')
    expect(hrefs.join).toBe('https://app.nammane.in/auth/login')
    expect(hrefs.discover).toBe('https://app.nammane.in/auth/login')
  })

  it('on the marketing site while signed in, Host/Join/Discover go straight to the app', () => {
    const hrefs = hrefsFor(true, true)
    expect(hrefs.host).toBe('https://app.nammane.in/host')
    expect(hrefs.join).toBe('https://app.nammane.in/discover')
    expect(hrefs.discover).toBe('https://app.nammane.in/discover')
  })
})
