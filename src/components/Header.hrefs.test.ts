import { describe, it, expect } from 'vitest'
import { hrefsFor } from './Header'

// Regression coverage for Home/logo navigation. Home and the logo always
// use hrefsFor(...).home, and it always resolves to the marketing site,
// nammane.in -- signed in or out, on either host. This went back and
// forth twice before landing here (see Header.tsx's own comment): it's
// safe now because src/lib/auth.ts and src/lib/supabase.ts scope the
// session cookie to the shared parent domain (.nammane.in), so a
// signed-in visit to nammane.in actually looks signed in instead of
// showing "Sign in / Sign up".
describe('Header hrefsFor', () => {
  it.each([
    [true, true],
    [true, false],
  ])('on the marketing site, home stays the relative path "/" (signedIn=%s)', (isMarketing, signedIn) => {
    const hrefs = hrefsFor(isMarketing, signedIn)
    expect(hrefs.home).toBe('/')
  })

  it.each([
    [false, true],
    [false, false],
  ])('inside the webapp, home crosses to the marketing site (signedIn=%s)', (isMarketing, signedIn) => {
    const hrefs = hrefsFor(isMarketing, signedIn)
    expect(hrefs.home).toBe('https://nammane.in')
  })

  it('on the webapp while signed in, every nav link except Home/Mobile App is a relative in-app route', () => {
    const hrefs = hrefsFor(false, true)
    for (const [key, href] of Object.entries(hrefs)) {
      if (key === 'home' || href === 'https://nammane.in/mobile-app') continue // intentionally cross-host
      expect(href.startsWith('http')).toBe(false)
    }
  })

  it('on the webapp while signed out, every nav link except Home/Mobile App is a relative in-app route', () => {
    const hrefs = hrefsFor(false, false)
    for (const [key, href] of Object.entries(hrefs)) {
      if (key === 'home' || href === 'https://nammane.in/mobile-app') continue // intentionally cross-host
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
