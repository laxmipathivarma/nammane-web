// Shared per-category visual language for every "event card" in the app
// (Discover's grid, the Host dashboard's list) so a poker card always
// reads as the same poker card wherever it shows up. Pulled out of
// EventCard.tsx so HostEventCard.tsx can reuse it instead of re-guessing
// a second palette.

export type EventCategory =
  | 'poker'
  | 'rummy'
  | 'drinks'
  | 'dinner'
  | 'party'
  | 'other'
  | 'marriage'
  | 'movie_night'
  | 'trip'
  | 'birthday'
  | 'fest'
  | 'meetup'
  | 'cycling'
  | 'biking'
  | 'trekking'
  | 'outing'
  | 'get_together'
  | 'engagement'

// The order every category picker (CategoryChips, host/create's picker)
// lists them in -- one array to keep in sync instead of three.
export const EVENT_CATEGORIES: EventCategory[] = [
  'poker',
  'rummy',
  'drinks',
  'dinner',
  'party',
  'marriage',
  'engagement',
  'birthday',
  'trip',
  'trekking',
  'cycling',
  'biking',
  'outing',
  'movie_night',
  'fest',
  'meetup',
  'get_together',
  'other',
]

export const categoryLabel: Record<EventCategory, string> = {
  poker: 'Poker',
  rummy: 'Rummy',
  drinks: 'Drinks',
  dinner: 'Dinner',
  party: 'Party',
  other: 'Other',
  marriage: 'Marriage',
  movie_night: 'Movie night',
  trip: 'Trip',
  birthday: 'Birthday',
  fest: 'Fest',
  meetup: 'Meet up',
  cycling: 'Cycling',
  biking: 'Biking',
  trekking: 'Trekking',
  outing: 'Outing',
  get_together: 'Get together',
  engagement: 'Engagement',
}

// One big, colorful emoji per category for the small 3D picker cards
// (CategoryChips, host/create's category picker) -- distinct from
// categoryIcon below, which is the thin line-icon badge used on a full
// EventCard, a different, smaller treatment that already works well and
// isn't part of this redesign.
export const categoryEmoji: Record<EventCategory, string> = {
  poker: '♠️',
  rummy: '🃏',
  drinks: '🍸',
  dinner: '🍽️',
  party: '🪩',
  other: '✨',
  marriage: '💍',
  movie_night: '🎬',
  trip: '✈️',
  birthday: '🎂',
  fest: '🎪',
  meetup: '🤝',
  cycling: '🚴',
  biking: '🏍️',
  trekking: '🥾',
  outing: '🧭',
  get_together: '🎉',
  engagement: '💐',
}

// The gradient behind each category's emoji badge in the small 3D picker
// cards -- same [light, dark] tuple shape as src/lib/avatars.ts's
// AVATAR_OPTIONS gradients, reusing the app's existing accent palette.
export const categoryBadgeGradient: Record<EventCategory, readonly [string, string]> = {
  poker: ['#8b3ffb', '#4a1397'],
  rummy: ['#c23ffb', '#8b3ffb'],
  drinks: ['#4cc9f0', '#1a8fd1'],
  dinner: ['#ffd166', '#e8942c'],
  party: ['#ff4f9e', '#c23ffb'],
  other: ['#9c93bd', '#4a4a6e'],
  marriage: ['#ff8fd1', '#c23ffb'],
  movie_night: ['#4a4a6e', '#1c1240'],
  trip: ['#8fe3ff', '#1a8fd1'],
  birthday: ['#ffd166', '#ff8fd1'],
  fest: ['#c23ffb', '#8b3ffb'],
  meetup: ['#7fe3a1', '#4cc9f0'],
  cycling: ['#c9f7a1', '#2c8f4a'],
  biking: ['#ffb37a', '#e8942c'],
  trekking: ['#9cd6c2', '#2c8f6a'],
  outing: ['#c9ecff', '#4cc9f0'],
  get_together: ['#ff8fd1', '#ff4f9e'],
  engagement: ['#ffe3b3', '#ffd166'],
}

export type CardStyle = {
  bg: string
  color: string
  iconBg: string
  badgeBg: string
  badgeColor: string
  shadow: string
  // NeoPOP-style hard "plinth" the card rests on, same mechanic as
  // .nm-btn-gold's offset shadow -- a solid color block behind the card,
  // not a blur, so the card reads as a physical object with real
  // thickness instead of a flat rectangle with a glow under it.
  plinth: string
  plinthDark: string
  ctaBg: string
  ctaColor: string
  avatarRing: string
  iconStroke?: boolean
}

export const cardStyle: Record<EventCategory, CardStyle> = {
  poker: {
    bg: 'linear-gradient(160deg,#ffffff,#e9e3f7)',
    color: '#1b1030',
    iconBg: 'rgba(27,16,48,.08)',
    badgeBg: 'rgba(139,63,251,.12)',
    badgeColor: '#6d1fd1',
    shadow: '0 2px 0 rgba(255,255,255,.8) inset, 0 16px 30px rgba(139,63,251,.3)',
    plinth: '#8b3ffb',
    plinthDark: '#4a1397',
    ctaBg: '#1b1030',
    ctaColor: '#fff',
    avatarRing: '#e9e3f7',
  },
  rummy: {
    bg: 'linear-gradient(160deg,#c9a8ff,#8b3ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.2)',
    badgeBg: 'rgba(255,255,255,.22)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(107,30,220,.35)',
    plinth: '#5e17b0',
    plinthDark: '#2e0a5c',
    ctaBg: '#fff',
    ctaColor: '#6d1fd1',
    avatarRing: '#8b3ffb',
  },
  drinks: {
    bg: 'linear-gradient(160deg,#8fe3ff,#1a8fd1)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.2)',
    badgeBg: 'rgba(255,255,255,.22)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(26,100,209,.35)',
    plinth: '#146aa8',
    plinthDark: '#0b3a5c',
    ctaBg: '#fff',
    ctaColor: '#1a8fd1',
    avatarRing: '#1a8fd1',
    iconStroke: true,
  },
  dinner: {
    bg: 'linear-gradient(160deg,#ffd37a,#e8942c)',
    color: '#3a2608',
    iconBg: 'rgba(58,38,8,.12)',
    badgeBg: 'rgba(58,38,8,.12)',
    badgeColor: '#3a2608',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(180,110,20,.35)',
    plinth: '#b46e14',
    plinthDark: '#623b0a',
    ctaBg: '#3a2608',
    ctaColor: '#fff',
    avatarRing: '#e8942c',
    iconStroke: true,
  },
  party: {
    bg: 'linear-gradient(160deg,#ff8fd1,#ff4f9e)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.22)',
    badgeBg: 'rgba(255,255,255,.22)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.35) inset, 0 16px 30px rgba(255,79,158,.35)',
    plinth: '#c21f6e',
    plinthDark: '#630e39',
    ctaBg: '#fff',
    ctaColor: '#ff4f9e',
    avatarRing: '#ff4f9e',
  },
  other: {
    bg: 'linear-gradient(160deg,#b9b4d6,#4a4a6e)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    badgeBg: 'rgba(255,255,255,.2)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(20,20,40,.35)',
    plinth: '#35355a',
    plinthDark: '#18182c',
    ctaBg: '#fff',
    ctaColor: '#4a4a6e',
    avatarRing: '#4a4a6e',
    iconStroke: true,
  },
  marriage: {
    bg: 'linear-gradient(160deg,#ff8fd1,#c23ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.22)',
    badgeBg: 'rgba(255,255,255,.22)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(168,31,122,.35)',
    plinth: '#a81f7a',
    plinthDark: '#5c0f44',
    ctaBg: '#fff',
    ctaColor: '#a81f7a',
    avatarRing: '#c23ffb',
  },
  movie_night: {
    bg: 'linear-gradient(160deg,#4a4a6e,#1c1240)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.14)',
    badgeBg: 'rgba(255,255,255,.16)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.2) inset, 0 16px 30px rgba(10,8,28,.5)',
    plinth: '#262240',
    plinthDark: '#120c22',
    ctaBg: '#fff',
    ctaColor: '#4a4a6e',
    avatarRing: '#4a4a6e',
  },
  trip: {
    bg: 'linear-gradient(160deg,#8fe3ff,#4cc9f0)',
    color: '#0b3a5c',
    iconBg: 'rgba(11,58,92,.12)',
    badgeBg: 'rgba(11,58,92,.12)',
    badgeColor: '#0b3a5c',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(26,143,209,.35)',
    plinth: '#1a8fd1',
    plinthDark: '#0b3a5c',
    ctaBg: '#0b3a5c',
    ctaColor: '#fff',
    avatarRing: '#4cc9f0',
    iconStroke: true,
  },
  birthday: {
    bg: 'linear-gradient(160deg,#ffd166,#ff8fd1)',
    color: '#4a2608',
    iconBg: 'rgba(74,38,8,.12)',
    badgeBg: 'rgba(74,38,8,.12)',
    badgeColor: '#4a2608',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(232,148,44,.35)',
    plinth: '#e8942c',
    plinthDark: '#7a4a10',
    ctaBg: '#4a2608',
    ctaColor: '#fff',
    avatarRing: '#ffd166',
    iconStroke: true,
  },
  fest: {
    bg: 'linear-gradient(160deg,#c23ffb,#8b3ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.22)',
    badgeBg: 'rgba(255,255,255,.22)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(94,23,176,.35)',
    plinth: '#5e17b0',
    plinthDark: '#2e0a5c',
    ctaBg: '#fff',
    ctaColor: '#6d1fd1',
    avatarRing: '#8b3ffb',
  },
  meetup: {
    bg: 'linear-gradient(160deg,#7fe3a1,#4cc9f0)',
    color: '#0b3a2a',
    iconBg: 'rgba(11,58,42,.12)',
    badgeBg: 'rgba(11,58,42,.12)',
    badgeColor: '#0b3a2a',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(44,143,74,.35)',
    plinth: '#2c8f4a',
    plinthDark: '#0f3a2a',
    ctaBg: '#0b3a2a',
    ctaColor: '#fff',
    avatarRing: '#7fe3a1',
    iconStroke: true,
  },
  cycling: {
    bg: 'linear-gradient(160deg,#c9f7a1,#7fe3a1)',
    color: '#1a3a0f',
    iconBg: 'rgba(26,58,15,.12)',
    badgeBg: 'rgba(26,58,15,.12)',
    badgeColor: '#1a3a0f',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(74,143,44,.35)',
    plinth: '#4a8f2c',
    plinthDark: '#1f3a0f',
    ctaBg: '#1a3a0f',
    ctaColor: '#fff',
    avatarRing: '#7fe3a1',
    iconStroke: true,
  },
  biking: {
    bg: 'linear-gradient(160deg,#ffb37a,#e8942c)',
    color: '#4a2608',
    iconBg: 'rgba(74,38,8,.14)',
    badgeBg: 'rgba(74,38,8,.14)',
    badgeColor: '#4a2608',
    shadow: '0 2px 0 rgba(255,255,255,.35) inset, 0 16px 30px rgba(180,110,20,.35)',
    plinth: '#b46e14',
    plinthDark: '#623b0a',
    ctaBg: '#4a2608',
    ctaColor: '#fff',
    avatarRing: '#e8942c',
    iconStroke: true,
  },
  trekking: {
    bg: 'linear-gradient(160deg,#9cd6c2,#2c8f6a)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.2)',
    badgeBg: 'rgba(255,255,255,.2)',
    badgeColor: '#fff',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 16px 30px rgba(31,92,70,.35)',
    plinth: '#1f5c46',
    plinthDark: '#0f2e23',
    ctaBg: '#fff',
    ctaColor: '#1f5c46',
    avatarRing: '#2c8f6a',
  },
  outing: {
    bg: 'linear-gradient(160deg,#c9ecff,#8fe3ff)',
    color: '#0b3a5c',
    iconBg: 'rgba(11,58,92,.12)',
    badgeBg: 'rgba(11,58,92,.12)',
    badgeColor: '#0b3a5c',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(76,201,240,.35)',
    plinth: '#4cc9f0',
    plinthDark: '#1a5c8f',
    ctaBg: '#0b3a5c',
    ctaColor: '#fff',
    avatarRing: '#8fe3ff',
    iconStroke: true,
  },
  get_together: {
    bg: 'linear-gradient(160deg,#ffd1e8,#ff4f9e)',
    color: '#4a0f30',
    iconBg: 'rgba(74,15,48,.14)',
    badgeBg: 'rgba(74,15,48,.14)',
    badgeColor: '#4a0f30',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(194,31,110,.35)',
    plinth: '#c21f6e',
    plinthDark: '#630e39',
    ctaBg: '#4a0f30',
    ctaColor: '#fff',
    avatarRing: '#ff4f9e',
    iconStroke: true,
  },
  engagement: {
    bg: 'linear-gradient(160deg,#ffe3b3,#ffd166)',
    color: '#4a2608',
    iconBg: 'rgba(74,38,8,.12)',
    badgeBg: 'rgba(74,38,8,.12)',
    badgeColor: '#4a2608',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 16px 30px rgba(232,148,44,.3)',
    plinth: '#e8942c',
    plinthDark: '#7a4a10',
    ctaBg: '#4a2608',
    ctaColor: '#fff',
    avatarRing: '#ffd166',
    iconStroke: true,
  },
}

export const categoryIcon: Record<EventCategory, string> = {
  poker: 'i-spade',
  rummy: 'i-diamond',
  drinks: 'i-martini',
  dinner: 'i-dine',
  party: 'i-party',
  other: 'i-grid',
  marriage: 'i-heart',
  movie_night: 'i-img',
  trip: 'i-pin',
  birthday: 'i-ticket',
  fest: 'i-disco',
  meetup: 'i-chat',
  cycling: 'i-bell',
  biking: 'i-link',
  trekking: 'i-flag',
  outing: 'i-home',
  get_together: 'i-user',
  engagement: 'i-star',
}
