'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { NAV_LABELS, type NavKey } from '@/lib/navMenu'
import { WEBAPP_VERSION_LABEL } from '@/lib/version'

// Destinations for the shared NAV_LABELS list (src/lib/navMenu.ts), which
// also drives the marketing site's Nav.tsx and Footer.tsx -- same items,
// same order, same labels in both places. Only the destination differs:
// the marketing site sends Host/Join/Discover through a login gate since
// the visitor isn't signed in yet; here, already inside the app, they go
// straight to the real page.
const HREFS: Record<NavKey, string> = {
  home: '/',
  host: '/host/create',
  join: '/discover',
  discover: '/discover',
  webapp: '/',
  mobile: 'https://nammane.in/mobile-app',
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appMenuOpen, setAppMenuOpen] = useState(false)
  const appMenuRef = useRef<HTMLDivElement>(null)

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
        {/* logo -- same mark + mixed-case wordmark as the marketing site's
            Nav (src/components/marketing-v2/Nav.tsx), so the app and the
            marketing site never show two different logos. Links back out
            to nammane.in (the marketing site), not to the app's own home --
            that's where people expect the logo to take them from inside
            the app, same as clicking a brand mark on any product site. */}
        <a href="https://nammane.in" className="flex items-center gap-2.5 shrink-0">
          <div className="nm2-logo-mark w-8 h-8 rounded-[28%] flex items-center justify-center shrink-0">
            <span className="nm2-heading text-white text-base font-black">N</span>
          </div>
          <span className="nm2-heading text-[#e4d4ff] text-lg font-extrabold" style={{ textTransform: 'none' }}>
            NamMane
          </span>
        </a>

        {/* nav links -- the exact same item set, labels and order as the
            marketing site's Nav.tsx (Home, Host, Join, Discover, Web App,
            Mobile App), from the shared src/lib/navMenu.ts list. */}
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

          <Link href="/auth/login" className="hidden sm:inline-flex text-[13px] font-bold text-[#e4d4ff] px-3 py-2 hover:text-gold-text transition-colors">
            Sign in
          </Link>
          <Link href="/auth/signup" className="nm-btn nm-btn-gold px-4 py-2 text-[13px]">
            Sign up
          </Link>

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

          <div className="border-t border-white/10 pt-3 flex gap-3">
            <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 nm-btn bg-ink2 text-white py-2.5 text-[13px]">
              Sign in
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1 nm-btn nm-btn-gold py-2.5 text-[13px]">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
