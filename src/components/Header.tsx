'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { NAV_LABELS, type NavKey } from '@/lib/navMenu'
import { WEBAPP_VERSION_LABEL } from '@/lib/version'
import { useAuth } from '@/lib/AuthProvider'

const LOGIN_URL = 'https://app.nammane.in/auth/login'
const WEBAPP_URL = 'https://app.nammane.in'

// This is the ONE header for both nammane.in (marketing) and
// app.nammane.in (the web app) -- same component, same shell, same
// logo, every time. Only the nav destinations and the right-side
// controls change, and only based on where you are (isMarketing) and
// whether you're signed in (user) -- never a different header
// component, so navigation can't land you somewhere that looks like
// a different site with a different session.
//
// On the marketing site: Host/Join/Discover go through the login
// gate when signed out, straight into the real app page when signed
// in. Inside the app itself, they're already relative in-app routes.
function hrefsFor(isMarketing: boolean, signedIn: boolean): Record<NavKey, string> {
  if (!isMarketing) {
    return { home: '/', host: '/host', join: '/discover', discover: '/discover', webapp: '/', mobile: 'https://nammane.in/mobile-app' }
  }
  const appHref = (path: string) => (signedIn ? `${WEBAPP_URL}${path}` : LOGIN_URL)
  return {
    home: '/',
    host: appHref('/host'),
    join: appHref('/discover'),
    discover: appHref('/discover'),
    webapp: WEBAPP_URL,
    mobile: '/mobile-app',
  }
}

export default function Header({ isMarketing = false }: { isMarketing?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appMenuOpen, setAppMenuOpen] = useState(false)
  const appMenuRef = useRef<HTMLDivElement>(null)
  const { user, loading, signOut } = useAuth()
  const HREFS = hrefsFor(isMarketing, !!user)

  // Short label for the signed-in pill -- email local-part, or the phone
  // number, whichever the person actually signed in with.
  const accountLabel = user?.email?.split('@')[0] ?? user?.phone ?? 'Account'

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (appMenuRef.current && !appMenuRef.current.contains(e.target as Node)) {
        setAppMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* logo -- a plain relative link to "/", never a hardcoded
            cross-host URL. middleware.ts already makes "/" resolve to
            the right page per host (marketing home on nammane.in, the
            app's own home on app.nammane.in), so clicking it never hops
            to a different host, and therefore never looks like a
            logout mid-navigation. */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="nm2-logo-mark w-8 h-8 rounded-[28%] flex items-center justify-center shrink-0">
            <span className="nm2-heading text-white text-base font-black">N</span>
          </div>
          <span className="nm2-heading text-[#e4d4ff] text-lg font-extrabold" style={{ textTransform: 'none' }}>
            NamMane
          </span>
        </Link>

        {/* nav links -- the exact same item set, labels and order
            everywhere (Home, Host, Join, Discover, Web App, Mobile App),
            from the shared src/lib/navMenu.ts list. Only where each one
            points differs (hrefsFor above). */}
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-semibold text-muted">
          {NAV_LABELS.map((item) => {
            const href = HREFS[item.key]
            return href.startsWith('http') ? (
              <a key={item.key} href={href} className="hover:text-gold-text transition-colors">
                {item.label}
              </a>
            ) : (
              <Link key={item.key} href={href} className="hover:text-gold-text transition-colors">
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* right controls */}
        <div className="flex items-center gap-2.5">
          {/* App switcher */}
          <div className="relative hidden sm:block" ref={appMenuRef}>
            <button
              onClick={() => setAppMenuOpen((v) => !v)}
              className="nm-btn px-3.5 py-2 text-[12px] bg-ink2 text-[#e4d4ff] border border-white/10"
            >
              Get the app
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 9 L12 16 L19 9" />
              </svg>
            </button>
            {appMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 nm-card rounded-2xl p-2 shadow-xl">
                <a
                  href="https://app.nammane.in"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center text-gold-text shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M8 21h8M12 18v3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">Web App</div>
                    <div className="text-[11px] text-muted">Use NamMane right now</div>
                    <div className="text-[10px] font-semibold text-muted2 mt-0.5">{WEBAPP_VERSION_LABEL}</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 opacity-60 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="7" y="2" width="10" height="20" rx="2" />
                      <path d="M11 18h2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">Mobile App</div>
                    <div className="text-[11px] text-muted">Coming soon for Android &amp; iOS</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!loading && (
            user ? (
              <>
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-[#e4d4ff] px-3 py-2 hover:text-gold-text transition-colors"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0" style={{ background: 'linear-gradient(160deg,#ff8fd1,#8b3ffb)' }}>
                    {accountLabel.charAt(0).toUpperCase()}
                  </span>
                  {accountLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="hidden sm:inline-flex nm-btn bg-ink2 text-white border border-white/10 px-4 py-2 text-[13px]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:inline-flex text-[13px] font-bold text-[#e4d4ff] px-3 py-2 hover:text-gold-text transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="hidden sm:inline-flex nm-btn nm-btn-gold px-4 py-2 text-[13px]">
                  Sign up
                </Link>
              </>
            )
          )}

          {/* mobile menu toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#e4d4ff]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-[14px] font-semibold text-[#e4d4ff] bg-ink">
          {/* same primary item set as desktop, matching the marketing site */}
          {NAV_LABELS.map((item) => {
            const href = HREFS[item.key]
            return href.startsWith('http') ? (
              <a key={item.key} href={href} onClick={() => setMobileOpen(false)}>
                {item.label}
              </a>
            ) : (
              <Link key={item.key} href={href} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            )
          })}

          {/* account-only pages -- kept out of the primary list above so
              it stays identical to the marketing site's menu */}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
            <Link href="/bookings" onClick={() => setMobileOpen(false)}>Bookings</Link>
            <Link href="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
          </div>

          <div className="text-[10.5px] font-semibold text-muted2">{WEBAPP_VERSION_LABEL}</div>

          {!loading && (
            user ? (
              <div className="border-t border-white/10 pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    signOut()
                  }}
                  className="flex-1 nm-btn bg-ink2 text-white py-2.5 text-[13px]"
                >
                  Sign out ({accountLabel})
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 pt-3 flex gap-3">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 nm-btn bg-ink2 text-white py-2.5 text-[13px]">
                  Sign in
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1 nm-btn nm-btn-gold py-2.5 text-[13px]">
                  Sign up
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </header>
  )
}
