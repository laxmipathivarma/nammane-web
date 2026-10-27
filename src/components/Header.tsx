'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="28" height="28" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="hdr-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e4d4ff" />
                <stop offset=".5" stopColor="#b968ff" />
                <stop offset="1" stopColor="#6d1fd1" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="58" fill="none" stroke="url(#hdr-gold)" strokeWidth="2.4" />
            <text x="60" y="78" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="58" fill="url(#hdr-gold)">N</text>
          </svg>
          <span className="nm-marquee text-lg text-[#e4d4ff] font-extrabold">NamMane</span>
        </Link>

        {/* nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-semibold text-muted">
          <Link href="/discover" className="hover:text-gold-text transition-colors">Discover</Link>
          <Link href="/#how-it-works" className="hover:text-gold-text transition-colors">How it works</Link>
          <Link href="/host/create" className="hover:text-gold-text transition-colors">Host an event</Link>
          <Link href="/bookings" className="hover:text-gold-text transition-colors">Bookings</Link>
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
          <Link href="/discover" onClick={() => setMobileOpen(false)}>Discover</Link>
          <Link href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it works</Link>
          <Link href="/host/create" onClick={() => setMobileOpen(false)}>Host an event</Link>
          <a href="https://app.nammane.in" className="text-gold-text">Web App</a>
          <Link href="/bookings" onClick={() => setMobileOpen(false)}>Bookings</Link>
          <Link href="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
          <span className="text-muted text-[13px]">Mobile App — coming soon for Android &amp; iOS</span>
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
