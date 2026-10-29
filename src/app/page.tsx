'use client'

import Link from 'next/link'
import CategoryChips from '@/components/CategoryChips'
import EventCard from '@/components/EventCard'
import WebAppHero3D from '@/components/WebAppHero3D'

const featured = [
  {
    title: 'High Stakes Friday',
    slug: 'high-stakes-friday',
    category: 'poker' as const,
    tagLabel: 'POKER',
    subtitle: "Texas Hold'em · No-limit · Intermediate",
    host: 'Hosted by Rahul · verified',
    hostInitials: 'RK',
    rating: '4.9',
    seatsLabel: '4/6 seats',
    seatsFilledPct: 67,
    ctaLabel: 'Request to join',
  },
  {
    title: 'Sunday 13-Card Social',
    slug: 'sunday-13-card-social',
    category: 'rummy' as const,
    tagLabel: 'RUMMY',
    subtitle: 'Points rummy · 2 tables · Casual',
    host: 'Hosted by Meera · verified',
    hostInitials: 'MS',
    rating: '4.8',
    seatsLabel: '10/12 seats',
    seatsFilledPct: 83,
    ctaLabel: 'Join waitlist',
  },
  {
    title: 'Rooftop Neon Soirée',
    slug: 'rooftop-neon-soiree',
    category: 'party' as const,
    tagLabel: 'PARTY',
    subtitle: 'Theme: Vegas lights',
    host: 'Hosted by Aisha · verified',
    hostInitials: 'AJ',
    rating: '4.9',
    seatsLabel: '18/30 going',
    seatsFilledPct: 60,
    ctaLabel: 'Request to join',
  },
]

export default function Home() {
  return (
    <div className="nm-root nm-bg min-h-screen text-white">
      {/* 3D animated entry hero -- from the webapp design handoff: paper-cut
          space scene (cave, Saturn, Jupiter, a drifting astronaut) with the
          sign in / create account CTAs built in. */}
      <WebAppHero3D />

      {/* role toggle */}
      <div className="flex justify-center px-5 pb-4 pt-8">
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
    </div>
  )
}
