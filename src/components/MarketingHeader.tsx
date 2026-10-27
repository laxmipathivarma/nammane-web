'use client'

import Link from 'next/link'
import { useState } from 'react'

const LOGIN_URL = 'https://app.nammane.in/auth/login'

const navItems = [
  { label: 'Home', href: '/', external: false },
  { label: 'Host', href: LOGIN_URL, external: true },
  { label: 'Join', href: LOGIN_URL, external: true },
  { label: 'Discover', href: LOGIN_URL, external: true },
]

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className="sticky top-0 z-50"
      style={{
        background:
          'radial-gradient(130% 400% at 18% -400%, #1c1240 0%, #0a081c 45%, #05050f 100%)',
      }}
    >
      <div className="text-center text-[11.5px] text-[#9c93bd] font-bold tracking-wide pt-2.5 px-5">
        Shuffling through every night out — Poker · Rummy · Drinks · Dinner · Karaoke
      </div>

      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="nm-logo-wrap">
              <div className="nm-logo-mark text-[16px]">N</div>
            </div>
            <span className="nm-head text-lg text-white font-extrabold">NamMane</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-bold text-[#cfc9e6]">
            {navItems.map((item) =>
              item.external ? (
                <a key={item.href + item.label} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              )
            )}
            <Link href="/mobile-app" className="hover:text-white transition-colors">
              Mobile App
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://app.nammane.in"
              className="hidden sm:inline-flex nm-btn nm-btn-ghost px-4 py-2.5 text-[13px]"
            >
              Web App
            </a>
            <a href="https://app.nammane.in/auth/signup" className="hidden sm:inline-flex nm-btn nm-btn-gold px-5 py-2.5 text-[13px]">
              Get started
            </a>

            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white"
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
          <div className="lg:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-[14px] font-semibold text-white bg-ink">
            {navItems.map((item) =>
              item.external ? (
                <a key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
            <Link href="/mobile-app" onClick={() => setMobileOpen(false)}>Mobile App</Link>
            <a href="https://app.nammane.in" className="text-gold-text">Web App</a>
            <div className="border-t border-white/10 pt-3 flex gap-3">
              <a href="https://app.nammane.in/auth/login" className="flex-1 nm-btn bg-ink2 text-white py-2.5 text-[13px] text-center">
                Sign in
              </a>
              <a href="https://app.nammane.in/auth/signup" className="flex-1 nm-btn nm-btn-gold py-2.5 text-[13px] text-center">
                Sign up
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
