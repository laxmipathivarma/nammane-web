import { describe, it, expect } from 'vitest'
import { hrefsFor } from './Header'

// Regression coverage for "clicking Home / the logo jumps to a different
// host" style bugs. Home and the logo always use hrefsFor(...).home, and
// the invariant that matters is: it is always a bare relative path, never
// an absolute app.nammane.in / nammane.in URL -- middleware.ts resolves
// "/" to the right page per host, so a relative link never causes a
// cross-host navigation (which is what makes the shared session cookie
// look like a random logout).
describe('Header hrefsFor', () => {
  it.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ])('home is always the relative path "/" (isMarketing=%s, signedIn=%s)', (isMarketing, signedIn) => {
    const hrefs = hrefsFor(isMarketing, signedIn)
    expect(hrefs.home).toBe('/')
    expect(hrefs.home.startsWith('http')).toBe(false)
  })

  it('on the webapp (isMarketing=false), every nav link is a relative in-app route', () => {
    const hrefs = hrefsFor(false, true)
    for (const href of Object.values(hrefs)) {
      if (href === 'https://nammane.in/mobile-app') continue // marketing-only destination, expected absolute
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
