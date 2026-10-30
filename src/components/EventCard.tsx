'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { cardStyle, categoryIcon, type EventCategory } from '@/lib/eventCardStyle'

export type EventCardData = {
  slug: string
  title: string
  category: EventCategory
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

export default function EventCard({ data }: { data: EventCardData }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const icon = categoryIcon[data.category]
  const s = cardStyle[data.category]
  const badge = typeof data.seatsFilledPct === 'number' ? data.seatsLabel : 'Approval required'

  // Pointer-reactive tilt: rotate toward the cursor and move the
  // highlight with it, written straight onto the element's own custom
  // properties so nothing re-renders on every mousemove.
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 12}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }

  return (
    <Link
      ref={ref}
      href={`/event/${data.slug}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="nm-tilt-card rounded-[24px] overflow-hidden flex flex-col"
      style={{
        background: s.bg,
        color: s.color,
        padding: 18,
        boxShadow: `${s.shadow}, 0 9px 0 0 ${s.plinth}, 0 9px 0 2px ${s.plinthDark}`,
      }}
    >
      <div className="nm-tilt-shine" />
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
