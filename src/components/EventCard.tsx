import Link from 'next/link'

export type EventCardData = {
  slug: string
  title: string
  category: 'poker' | 'rummy' | 'drinks' | 'dinner' | 'party' | 'other'
  tagLabel: string
  subtitle: string
  priceLabel?: string
  host?: string
  hostInitials?: string
  rating?: string
  seatsLabel?: string
  seatsFilledPct?: number
  ctaLabel: string
}

type CardStyle = {
  bg: string
  color: string
  iconBg: string
  badgeBg: string
  badgeColor: string
  shadow: string
  ctaBg: string
  ctaColor: string
  avatarRing: string
  iconStroke?: boolean
}

const cardStyle: Record<EventCardData['category'], CardStyle> = {
  poker: {
    bg: 'linear-gradient(160deg,#ffffff,#e9e3f7)',
    color: '#1b1030',
    iconBg: 'rgba(27,16,48,.08)',
    badgeBg: 'rgba(139,63,251,.12)',
    badgeColor: '#6d1fd1',
    shadow: '0 2px 0 rgba(255,255,255,.8) inset, 0 16px 30px rgba(139,63,251,.3)',
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
    ctaBg: '#fff',
    ctaColor: '#4a4a6e',
    avatarRing: '#4a4a6e',
    iconStroke: true,
  },
}

const categoryIcon: Record<EventCardData['category'], string> = {
  poker: 'i-spade',
  rummy: 'i-diamond',
  drinks: 'i-martini',
  dinner: 'i-dine',
  party: 'i-party',
  other: 'i-grid',
}

export default function EventCard({ data }: { data: EventCardData }) {
  const icon = categoryIcon[data.category]
  const s = cardStyle[data.category]
  const badge = typeof data.seatsFilledPct === 'number' ? data.seatsLabel : 'Approval required'

  return (
    <Link
      href={`/event/${data.slug}`}
      className="rounded-[24px] overflow-hidden flex flex-col relative p-4.5 transition-transform hover:-translate-y-0.5"
      style={{ background: s.bg, color: s.color, boxShadow: s.shadow, padding: 18 }}
    >
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.35), transparent 45%)' }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8.5 h-8.5 rounded-[11px] flex items-center justify-center shrink-0" style={{ width: 34, height: 34, background: s.iconBg }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={s.iconStroke ? 'none' : 'currentColor'} stroke={s.iconStroke ? 'currentColor' : 'none'} strokeWidth="1.7">
              <use href={`#${icon}`} />
            </svg>
          </div>
          <div className="text-[11px] font-extrabold tracking-wide opacity-70">{data.tagLabel}</div>
        </div>
        <div className="text-[10.5px] font-extrabold px-2.5 py-1.5 rounded-full shrink-0" style={{ background: s.badgeBg, color: s.badgeColor }}>
          {badge}
        </div>
      </div>

      <div className="relative nm-marquee text-[17px] font-extrabold mt-3.5">{data.title}</div>
      <div className="relative text-[12px] font-bold opacity-65 mt-1">{data.subtitle}</div>

      <div className="relative flex items-center justify-between mt-4">
        <div className="flex items-center">
          <div
            className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-extrabold"
            style={{ width: 26, height: 26, background: '#ff7fc2', border: `2px solid ${s.avatarRing}` }}
          />
          <div
            className="w-6.5 h-6.5 rounded-full -ml-2 flex items-center justify-center text-[9px] font-extrabold"
            style={{ width: 26, height: 26, background: '#5fd0ff', border: `2px solid ${s.avatarRing}` }}
          />
          {data.hostInitials && (
            <div
              className="w-6.5 h-6.5 rounded-full -ml-2 flex items-center justify-center text-[9px] font-extrabold text-white"
              style={{ width: 26, height: 26, background: '#b968ff', border: `2px solid ${s.avatarRing}` }}
            >
              {data.hostInitials}
            </div>
          )}
        </div>
        <div className="nm-btn text-[12px] px-4 py-2.5" style={{ background: s.ctaBg, color: s.ctaColor }}>
          {data.ctaLabel}
        </div>
      </div>
    </Link>
  )
}
