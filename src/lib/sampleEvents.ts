export type EventCategory = 'poker' | 'rummy' | 'drinks' | 'dinner' | 'party' | 'other'

export type EventDetail = {
  slug: string
  title: string
  category: EventCategory
  tagLabel: string
  format: string
  rating: string
  reviewCount: number
  eventsHosted: number
  host: {
    name: string
    initials: string
    since: string
    verified: boolean
  }
  schedule: string
  area: string
  seatsLabel: string
  seatsFilledPct: number
  seatsLeft: number
  /** Host-controlled. Only rendered when the host has explicitly set a price — hidden otherwise. */
  priceLabel?: string
  houseRules: string
  guests: { initials: string; color: string }[]
}

export const EVENTS: Record<string, EventDetail> = {
  'high-stakes-friday': {
    slug: 'high-stakes-friday',
    title: 'High Stakes Friday',
    category: 'poker',
    tagLabel: "POKER · TEXAS HOLD'EM",
    format: "Texas Hold'em · No-limit · Intermediate",
    rating: '4.9',
    reviewCount: 38,
    eventsHosted: 12,
    host: { name: 'Rahul Kapoor', initials: 'RK', since: '2025', verified: true },
    schedule: 'This Friday · 8:30 PM – 1 AM',
    area: 'Indiranagar',
    seatsLabel: '4 / 6 filled',
    seatsFilledPct: 67,
    seatsLeft: 2,
    houseRules:
      "Chips-only play — no real-money wagering on NamMane. BYO snacks, host provides chips & cards. Please arrive by 8:45 PM; no-shows after 2 events may be removed from future tables.",
    guests: [
      { initials: 'RK', color: '#9c3344' },
      { initials: 'SM', color: '#4a2e1a' },
      { initials: 'AJ', color: '#16804f' },
    ],
  },
  'sunday-13-card-social': {
    slug: 'sunday-13-card-social',
    title: 'Sunday 13-Card Social',
    category: 'rummy',
    tagLabel: 'RUMMY · POINTS RUMMY',
    format: 'Points rummy · 2 tables · Casual',
    rating: '4.8',
    reviewCount: 24,
    eventsHosted: 9,
    host: { name: 'Meera Shah', initials: 'MS', since: '2025', verified: true },
    schedule: 'Sunday · 5 PM – 8 PM',
    area: 'HSR Layout',
    seatsLabel: '10 / 12 filled',
    seatsFilledPct: 83,
    seatsLeft: 2,
    houseRules:
      'Casual stakes, beginners welcome. Host provides cards and score sheets — just bring yourself and a snack to share.',
    guests: [
      { initials: 'MS', color: '#4a2e1a' },
      { initials: 'PK', color: '#5a3414' },
      { initials: 'RT', color: '#9c3344' },
    ],
  },
  'copper-and-smoke': {
    slug: 'copper-and-smoke',
    title: 'Copper & Smoke',
    category: 'drinks',
    tagLabel: 'DRINKS · 21+',
    format: 'BYOB · Snacks on the house · 21+',
    rating: '4.7',
    reviewCount: 16,
    eventsHosted: 6,
    host: { name: 'Varun Kumar', initials: 'VK', since: '2026', verified: true },
    schedule: 'Saturday · 7 PM – 11 PM',
    area: 'Koramangala',
    seatsLabel: '14 / 20 going',
    seatsFilledPct: 70,
    seatsLeft: 6,
    houseRules: 'BYOB — host provides mixers, ice and snacks. Please drink responsibly and arrange your own ride home.',
    guests: [
      { initials: 'VK', color: '#5a3414' },
      { initials: 'NS', color: '#8a2332' },
      { initials: 'PR', color: '#16804f' },
    ],
  },
  'an-evening-table': {
    slug: 'an-evening-table',
    title: 'An Evening Table',
    category: 'dinner',
    tagLabel: 'DINNER',
    format: 'Mediterranean set menu · Seats 8',
    rating: '5.0',
    reviewCount: 21,
    eventsHosted: 11,
    host: { name: 'Priya Srinivas', initials: 'PS', since: '2025', verified: true },
    schedule: 'Tonight · 8 PM – 10:30 PM',
    area: 'Whitefield',
    seatsLabel: '6 / 8 filled',
    seatsFilledPct: 75,
    seatsLeft: 2,
    houseRules: 'Set menu, dietary notes welcome at RSVP. Please arrive on time — the kitchen plates everything together.',
    guests: [
      { initials: 'PS', color: '#5c1620' },
      { initials: 'KN', color: '#4a2e1a' },
      { initials: 'AJ', color: '#16804f' },
    ],
  },
  'rooftop-neon-soiree': {
    slug: 'rooftop-neon-soiree',
    title: 'Rooftop Neon Soirée',
    category: 'party',
    tagLabel: 'PARTY · THEME NIGHT',
    format: 'Theme: Vegas lights',
    rating: '4.9',
    reviewCount: 32,
    eventsHosted: 8,
    host: { name: 'Aisha Jain', initials: 'AJ', since: '2026', verified: true },
    schedule: 'Saturday · 9 PM – 1 AM',
    area: 'Koramangala',
    seatsLabel: '18 / 30 going',
    seatsFilledPct: 60,
    seatsLeft: 12,
    houseRules: 'Dress to the theme if you like — not required. Host supplies music and lighting; bring your own drinks.',
    guests: [
      { initials: 'AJ', color: '#8a2332' },
      { initials: 'RK', color: '#9c3344' },
      { initials: 'MS', color: '#4a2e1a' },
    ],
  },
  'board-game-marathon': {
    slug: 'board-game-marathon',
    title: 'Board Game Marathon',
    category: 'other',
    tagLabel: 'OTHER',
    format: 'Custom event · Snacks & chill music',
    rating: '4.6',
    reviewCount: 13,
    eventsHosted: 5,
    host: { name: 'Karthik N.', initials: 'KN', since: '2026', verified: true },
    schedule: 'Sunday · 3 PM – 7 PM',
    area: 'Jayanagar',
    seatsLabel: '5 / 10 filled',
    seatsFilledPct: 50,
    seatsLeft: 5,
    houseRules: 'Bring your favorite board game if you have one — host has a shelf of classics too. Snacks provided.',
    guests: [
      { initials: 'KN', color: '#2c2c2c' },
      { initials: 'VK', color: '#5a3414' },
      { initials: 'PS', color: '#5c1620' },
    ],
  },
}

export const categoryHero: Record<EventCategory, string> = {
  poker: 'radial-gradient(85% 100% at 50% 20%, #1f7a4f 0%, #0f4229 55%, #082318 100%)',
  rummy: 'radial-gradient(85% 100% at 50% 20%, #5a3414 0%, #2e1a0a 55%, #170d05 100%)',
  drinks: 'radial-gradient(85% 100% at 50% 20%, #6b3d16 0%, #35200c 55%, #180d05 100%)',
  dinner: 'radial-gradient(85% 100% at 50% 20%, #6b1c28 0%, #350f16 55%, #170709 100%)',
  party: 'radial-gradient(85% 100% at 50% 20%, #8a2332 0%, #4a1a1e 55%, #180c0c 100%)',
  other: 'radial-gradient(85% 100% at 50% 20%, #343434 0%, #1c1c1c 55%, #0c0c0c 100%)',
}

export const categoryIcon: Record<EventCategory, string> = {
  poker: 'i-spade',
  rummy: 'i-diamond',
  drinks: 'i-martini',
  dinner: 'i-dine',
  party: 'i-party',
  other: 'i-grid',
}
