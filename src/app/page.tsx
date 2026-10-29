'use client'

import { useState } from 'react'
import Link from 'next/link'
import CategoryChips, { CATEGORIES } from '@/components/CategoryChips'
import EventCard, { EventCardData } from '@/components/EventCard'
import WebAppHero3D from '@/components/WebAppHero3D'

// One sample event per category so every chip in CategoryChips has
// something to show -- previously this list only had poker/rummy/party
// hardcoded, so switching to Drinks (or Dinner/Other) showed nothing, and
// the list wasn't even wired to the chips' onChange in the first place.
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

export default function Home() {
  const [role, setRole] = useState<'guest' | 'host'>('guest')
  const [filter, setFilter] = useState<string>('poker')

  const visible = ALL_EVENTS.filter((e) => e.category === filter)
  const activeLabel = CATEGORIES.find((c) => c.key === filter)?.label ?? ''

  return (
    <div className="nm-root nm-bg min-h-screen text-white">
      {/* 3D animated entry hero -- from the webapp design handoff: paper-cut
          space scene (cave, Saturn, Jupiter, a drifting astronaut) with the
          sign in / create account CTAs built in. */}
      <WebAppHero3D />

      {/* role toggle -- these were plain <div>s with no onClick, so nothing
          happened on tap. Now a real toggle: Guest mode browses and filters
          tonight's events same as before; Host mode swaps the section below
          for a "host your own" prompt instead of the browse grid. */}
      <div className="flex justify-center px-5 pb-4 pt-8">
        <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px]">
          <button
            type="button"
            onClick={() => setRole('guest')}
            className={role === 'guest' ? 'nm-btn nm-btn-gold px-4.5 py-1.5 text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
            style={{ padding: '6px 18px' }}
          >
            Guest mode
          </button>
          <button
            type="button"
            onClick={() => setRole('host')}
            className={role === 'host' ? 'nm-btn nm-btn-gold px-4.5 py-1.5 text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
            style={{ padding: '6px 18px' }}
          >
            Host mode
          </button>
        </div>
      </div>

      {role === 'guest' ? (
        <>
          {/* category rail */}
          <div className="px-5 pb-4 max-w-5xl mx-auto">
            <CategoryChips onChange={setFilter} />
          </div>

          {/* events for the selected category */}
          <div className="px-5 pb-16 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="nm-marquee text-base text-gold-text font-extrabold">
                {activeLabel} tonight
              </div>
              <Link href="/discover" className="text-[11px] text-muted font-bold">
                See all ›
              </Link>
            </div>
            {visible.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map((e) => (
                  <EventCard key={e.title} data={e} />
                ))}
              </div>
            ) : (
              <div className="nm-card rounded-[20px] p-6 text-center text-muted text-[13.5px] font-medium">
                No {activeLabel.toLowerCase()} nights up yet tonight &mdash; check{' '}
                <Link href="/discover" className="text-gold-text font-bold">
                  Discover
                </Link>{' '}
                for everything else happening.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="px-5 pb-16 max-w-5xl mx-auto">
          <div className="nm-card rounded-[28px] p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="nm-marquee text-2xl md:text-3xl text-white mb-2">Host your own night</div>
              <p className="text-muted text-[14px] font-medium leading-relaxed max-w-md">
                Set up a table, approve who joins, and keep control of your guest list. Poker,
                dinner, drinks, karaoke &mdash; whatever your thing is.
              </p>
            </div>
            <Link href="/host/create" className="nm-btn nm-btn-gold px-6 py-3 text-[13.5px] shrink-0">
              Host an event
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
