'use client'

import Link from 'next/link'
import CategoryChips from '@/components/CategoryChips'
import EventCard from '@/components/EventCard'
import LandingHero from '@/components/LandingHero'

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
      <LandingHero />

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
