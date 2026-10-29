'use client'

import Link from 'next/link'
import { useState } from 'react'
import { NAV_LABELS, type NavKey } from '@/lib/navMenu'

const LOGIN_URL = 'https://app.nammane.in/auth/login'
const SIGNUP_URL = 'https://app.nammane.in/auth/signup'

// Destinations for the shared NAV_LABELS list (src/lib/navMenu.ts), which
// also drives Footer.tsx's "Explore" column and the app's Header.tsx --
// same items, same order, same labels everywhere, so no two menus on the
// site can ever drift into showing a different set again.
const HREFS: Record<NavKey, string> = {
  home: '/',
  host: LOGIN_URL,
  join: LOGIN_URL,
  discover: LOGIN_URL,
  webapp: 'https://app.nammane.in',
  mobile: '/mobile-app',
}
const navItems = NAV_LABELS.map((item) => ({
  label: item.label,
  href: HREFS[item.key],
  external: item.key !== 'home' && item.key !== 'mobile',
}))

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <div className="nm2-logo-mark w-10 h-10 rounded-[28%] flex items-center justify-center shrink-0">
        <span className="nm2-heading text-white text-lg font-black">N</span>
      </div>
      <span
        className="nm2-heading text-white text-[18px] font-extrabold"
        style={{ textTransform: 'none' }}
      >
        NamMane
      </span>
    </Link>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="sticky top-0 z-50 bg-[var(--nm-base)]/80 backdrop-blur-md">
      <header className="flex items-center justify-between" style={{ padding: '22px clamp(18px,4vw,56px)' }}>
        <Logo />

        <nav className="hidden lg:flex items-center gap-7 text-[12px] font-bold uppercase tracking-wide text-[var(--nm-text-body)]">
          {navItems.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} className="hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={LOGIN_URL}
            className="nm2-glass h-11 px-5 rounded-full flex items-center gap-2 text-[13px] font-bold text-white hover:border-[var(--nm-cyan)] hover:shadow-[0_0_18px_rgba(76,201,240,.35)] transition-all"
          >
            <i className="ph ph-user-circle text-[var(--nm-cyan)] text-[16px]" />
            Sign in
          </a>
          <a
            href={SIGNUP_URL}
            className="nm2-grad-pill h-11 pl-5 pr-1.5 rounded-full flex items-center gap-3 text-[13px] font-bold text-white hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,79,158,.5)] transition-all"
          >
            Get started
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B3FFB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        <button
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </header>

      {open && (
        <div className="lg:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-3.5 text-[14.5px] font-semibold text-white bg-[var(--nm-night)]">
          {navItems.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            )
          )}
          <div className="border-t border-white/10 pt-3.5 flex gap-3">
            <a href={LOGIN_URL} className="flex-1 nm2-glass rounded-full text-white py-2.5 text-[13px] text-center font-bold">
              Sign in
            </a>
            <a href={SIGNUP_URL} className="flex-1 nm2-grad-pill rounded-full py-2.5 text-[13px] text-center font-bold text-white">
              Sign up
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
