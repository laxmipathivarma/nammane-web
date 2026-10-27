'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Host an Event', href: '/host-an-event' },
  { label: 'Join the Event', href: '/join-the-event' },
  { label: 'Find the Event', href: '/find-the-event' },
]

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="28" height="28" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="mhdr-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e4d4ff" />
                <stop offset=".5" stopColor="#b968ff" />
                <stop offset="1" stopColor="#6d1fd1" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="58" fill="none" stroke="url(#mhdr-gold)" strokeWidth="2.4" />
            <text x="60" y="78" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="58" fill="url(#mhdr-gold)">N</text>
          </svg>
          <span className="nm-marquee text-lg text-[#e4d4ff] font-extrabold">NamMane</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-semibold text-muted">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gold-text transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/mobile-app" className="hover:text-gold-text transition-colors">
            Mobile App
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="https://app.nammane.in"
            className="hidden sm:inline-flex nm-btn px-3.5 py-2 text-[12px] bg-ink2 text-[#e4d4ff] border border-white/10"
          >
            Web App
          </a>
          <a href="https://app.nammane.in/auth/signup" className="hidden sm:inline-flex nm-btn nm-btn-gold px-4 py-2 text-[13px]">
            Get started
          </a>

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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
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
  )
}
