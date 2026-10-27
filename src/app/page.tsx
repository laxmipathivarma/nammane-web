'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CategoryChips from '@/components/CategoryChips'
import EventCard from '@/components/EventCard'

const eventWords = [
  'Poker Night',
  'Game Night',
  'Dinner',
  'Karaoke Night',
  'Dance Party',
  'Birthday Party',
  'Drinks Night',
  'Movie Night',
  'Brunch',
  'Rooftop Party',
]

const featured = [
  {
    title: 'High Stakes Friday',
    category: 'poker' as const,
    tagLabel: 'POKER',
    subtitle: "Texas Hold'em · No-limit · Intermediate",
    priceLabel: '₹500 buy-in',
    host: 'Hosted by Rahul · verified',
    hostInitials: 'RK',
    rating: '4.9',
    seatsLabel: '4/6 seats',
    seatsFilledPct: 67,
    ctaLabel: 'Request to join',
  },
  {
    title: 'Sunday 13-Card Social',
    category: 'rummy' as const,
    tagLabel: 'RUMMY',
    subtitle: 'Points rummy · 2 tables · Casual',
    priceLabel: 'Free entry',
    host: 'Hosted by Meera · verified',
    hostInitials: 'MS',
    rating: '4.8',
    seatsLabel: '10/12 seats',
    seatsFilledPct: 83,
    ctaLabel: 'Join waitlist',
  },
  {
    title: 'Rooftop Neon Soirée',
    category: 'party' as const,
    tagLabel: 'PARTY',
    subtitle: 'Theme: Vegas lights · ₹800 contribution',
    host: 'Hosted by Aisha · verified',
    hostInitials: 'AJ',
    rating: '4.9',
    seatsLabel: '18/30 going',
    seatsFilledPct: 60,
    ctaLabel: 'Request to join',
  },
]

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % eventWords.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="nm-root nm-bg min-h-screen text-[#f5efe3]">
      {/* header / marquee */}
      <div className="relative px-5 pt-6 pb-4 overflow-hidden">
        <div
          className="absolute -inset-x-5 -top-10 h-56 pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 0%, rgba(178,58,74,.12), rgba(205,168,88,.08), transparent 40%, transparent 60%, rgba(178,58,74,.12))',
            filter: 'blur(2px)',
          }}
        />
        <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[#e8ddc8] text-xs font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8ddc8" strokeWidth="2">
              <path d="M12 22 C12 22 20 15 20 9 A8 8 0 0 0 4 9 C4 15 12 22 12 22Z" />
              <circle cx="12" cy="9" r="2.6" fill="#e8ddc8" stroke="none" />
            </svg>
            Bengaluru · Mumbai · Delhi NCR
          </div>
          <div className="w-8 h-8 rounded-full bg-ink2 border border-gold/40 flex items-center justify-center text-gold">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <use href="#i-bell" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-center mt-4 flex flex-col items-center max-w-3xl mx-auto">
          <svg width="52" height="52" viewBox="0 0 120 120" className="mb-2">
            <use href="#nm-mark" />
          </svg>
          <h1 className="nm-marquee text-[#e8d9ac] text-4xl md:text-5xl leading-none">NamMane</h1>
          <div className="text-[13px] md:text-sm text-muted font-semibold tracking-wide mt-3">
            Find your table.
          </div>

          <div className="h-12 overflow-hidden mt-5 w-full max-w-sm">
            <div
              className="transition-transform duration-700 ease-in-out"
              style={{ transform: `translateY(-${currentWordIndex * 48}px)` }}
            >
              {eventWords.map((word, idx) => (
                <div key={idx} className="h-12 flex items-center justify-center text-2xl md:text-3xl font-extrabold text-gold-text nm-marquee">
                  {word}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[13.5px] text-muted mt-4 font-medium max-w-md">
            Tonight&apos;s hottest tables, your rules. Discover approval-based gatherings, or host your own.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-sm">
            <Link href="/auth/signup" className="nm-btn nm-btn-gold flex-1 px-6 py-3 text-[13.5px]">
              Get started
            </Link>
            <Link href="/discover" className="nm-btn nm-btn-outline flex-1 px-6 py-3 text-[13.5px]">
              Explore events
            </Link>
          </div>
        </div>
      </div>

      {/* role toggle */}
      <div className="flex justify-center px-5 pb-4">
        <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px]">
          <div className="nm-btn nm-btn-gold px-4.5 py-1.5 text-[11.5px]" style={{ padding: '6px 18px' }}>
            Guest mode
          </div>
          <div className="nm-btn text-[11.5px] font-bold text-muted" style={{ padding: '6px 18px' }}>
            Host mode
          </div>
        </div>
      </div>

      {/* category rail */}
      <div className="px-5 pb-4 max-w-5xl mx-auto">
        <CategoryChips />
      </div>

      {/* featured events */}
      <div className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="nm-marquee text-base text-gold-text font-extrabold">Tonight&apos;s Tables</div>
          <Link href="/discover" className="text-[11px] text-muted font-bold">
            See all ›
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((e) => (
            <EventCard key={e.title} data={e} />
          ))}
        </div>
      </div>

      {/* feature strip */}
      <div className="px-5 pb-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard title="Easy Discovery" description="Browse events in your city, filter by category, and find your vibe." icon="i-grid" />
        <FeatureCard title="Trusted Community" description="Host verification, approval-based bookings, and safety first." icon="i-shield" />
        <FeatureCard title="Direct Chat" description="Connect with hosts and guests before and during events." icon="i-chat" />
      </div>

      <footer className="text-center text-muted text-xs border-t border-white/10 pt-6 pb-10 px-5">
        <p className="mb-1 font-semibold">Version 0.1.0 · Wave 1: Web App</p>
        <p>Built for Bengaluru, Mumbai, and Delhi NCR</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="nm-card rounded-2xl p-6">
      <div className="w-10 h-10 rounded-full bg-ink2 border border-gold/30 flex items-center justify-center text-gold-text mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <use href={`#${icon}`} />
        </svg>
      </div>
      <h3 className="nm-marquee text-lg text-white mb-2">{title}</h3>
      <p className="text-muted text-[13.5px] font-medium leading-relaxed">{description}</p>
    </div>
  )
}
