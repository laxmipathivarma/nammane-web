'use client'

import Link from 'next/link'
import { useState } from 'react'

const LOGIN_URL = 'https://app.nammane.in/auth/login'
const SIGNUP_URL = 'https://app.nammane.in/auth/signup'
const WEBAPP_URL = 'https://app.nammane.in'

const navItems = [
  { label: 'Home', href: '/', external: false },
  { label: 'Host', href: LOGIN_URL, external: true },
  { label: 'Join', href: LOGIN_URL, external: true },
  { label: 'Discover', href: LOGIN_URL, external: true },
  { label: 'Web App', href: WEBAPP_URL, external: true },
  { label: 'Mobile App', href: '/mobile-app', external: false },
]

function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: 'linear-gradient(135deg,#c968ff,#ff4f9e)',
          boxShadow: '0 0 0 1px rgba(255,255,255,.18) inset, 0 4px 14px rgba(201,104,255,.45)',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
          <use href="#i-spade" />
        </svg>
      </div>
      <span className="nm-head text-lg text-white font-extrabold">NamMane</span>
    </Link>
  )
}

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className="sticky top-0 z-50"
      style={{
        background: 'radial-gradient(130% 400% at 18% -400%, #1c1240 0%, #0a081c 45%, #05050f 100%)',
      }}
    >
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <HeaderLogo />

          <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-bold text-[#cfc9e6]">
            {navItems.map((item) =>
              item.external ? (
                <a key={item.href + item.label} href={item.href} className="hover:text-white transition-colors whitespace-nowrap">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href + item.label} href={item.href} className="hover:text-white transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            <a href={LOGIN_URL} className="nm-btn nm-btn-ghost px-4 py-2.5 text-[13px]">
              Sign in
            </a>
            <a href={SIGNUP_URL} className="nm-btn nm-btn-gold px-5 py-2.5 text-[13px]">
              Get started
            </a>
          </div>

          <button
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-3.5 text-[14.5px] font-semibold text-white bg-ink">
            {navItems.map((item) =>
              item.external ? (
                <a key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
            <div className="border-t border-white/10 pt-3.5 flex gap-3">
              <a href={LOGIN_URL} className="flex-1 nm-btn bg-ink2 text-white py-2.5 text-[13px] text-center">
                Sign in
              </a>
              <a href={SIGNUP_URL} className="flex-1 nm-btn nm-btn-gold py-2.5 text-[13px] text-center">
                Sign up
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
