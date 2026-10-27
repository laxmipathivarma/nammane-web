'use client'

import { useState } from 'react'
import CategoryChips, { CATEGORIES } from '@/components/CategoryChips'
import EventCard, { EventCardData } from '@/components/EventCard'

const ALL_EVENTS: EventCardData[] = [
  {
    title: 'High Stakes Friday',
    slug: 'high-stakes-friday',
    category: 'poker',
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
    category: 'rummy',
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
    title: 'Copper & Smoke',
    slug: 'copper-and-smoke',
    category: 'drinks',
    tagLabel: 'DRINKS',
    subtitle: 'BYOB · Snacks on the house · 21+',
    host: 'Hosted by Varun · verified',
    hostInitials: 'VK',
    rating: '4.7',
    seatsLabel: '14/20 going',
    seatsFilledPct: 70,
    ctaLabel: 'Request to join',
  },
  {
    title: 'An Evening Table',
    slug: 'an-evening-table',
    category: 'dinner',
    tagLabel: 'DINNER',
    subtitle: 'Mediterranean set menu · Seats 8',
    host: 'Hosted by Priya · verified',
    hostInitials: 'PS',
    rating: '5.0',
    seatsLabel: '6/8 seats',
    seatsFilledPct: 75,
    ctaLabel: 'Request to join',
  },
  {
    title: 'Rooftop Neon Soirée',
    slug: 'rooftop-neon-soiree',
    category: 'party',
    tagLabel: 'PARTY',
    subtitle: 'Theme: Vegas lights',
    host: 'Hosted by Aisha · verified',
    hostInitials: 'AJ',
    rating: '4.9',
    seatsLabel: '18/30 going',
    seatsFilledPct: 60,
    ctaLabel: 'Request to join',
  },
  {
    title: 'Board Game Marathon',
    slug: 'board-game-marathon',
    category: 'other',
    tagLabel: 'OTHER',
    subtitle: 'Custom event · Snacks & chill music',
    host: 'Hosted by Karthik · verified',
    hostInitials: 'KN',
    rating: '4.6',
    seatsLabel: '5/10 seats',
    seatsFilledPct: 50,
    ctaLabel: 'Request to join',
  },
]

export default function Discover() {
  const [filter, setFilter] = useState<string>('poker')
  const visible = ALL_EVENTS.filter((e) => e.category === filter)
  const activeLabel = CATEGORIES.find((c) => c.key === filter)?.label ?? ''

  return (
    <div className="nm-root nm-bg min-h-screen text-[#f5efe3]">
      <div className="px-5 pt-8 pb-4 max-w-5xl mx-auto">
        <h1 className="nm-marquee text-2xl md:text-3xl text-gold-text font-extrabold">Discover</h1>
        <p className="text-[12.5px] text-muted font-semibold mt-1">Tonight&apos;s hottest tables, your rules</p>
      </div>

      <div className="px-5 pb-6 max-w-5xl mx-auto">
        <CategoryChips onChange={setFilter} />
      </div>

      <div className="px-5 pb-20 max-w-5xl mx-auto">
        <div className="text-[13px] text-muted font-bold mb-4">
          {visible.length} {activeLabel} {visible.length === 1 ? 'event' : 'events'} near you
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((e) => (
            <EventCard key={e.title} data={e} />
          ))}
        </div>
      </div>
    </div>
  )
}
