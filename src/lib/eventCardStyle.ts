// Shared per-category visual language for every "event card" in the app
// (Discover's grid, the Host dashboard's list) so a poker card always
// reads as the same poker card wherever it shows up. Pulled out of
// EventCard.tsx so HostEventCard.tsx can reuse it instead of re-guessing
// a second palette.

export type EventCategory = 'poker' | 'rummy' | 'drinks' | 'dinner' | 'party' | 'other'

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
}

export const categoryIcon: Record<EventCategory, string> = {
  poker: 'i-spade',
  rummy: 'i-diamond',
  drinks: 'i-martini',
  dinner: 'i-dine',
  party: 'i-party',
  other: 'i-grid',
}
