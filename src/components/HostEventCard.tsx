'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { cardStyle, categoryIcon, type EventCategory } from '@/lib/eventCardStyle'
import { isEventCompleted } from '@/lib/eventStatus'

export type HostEventCardData = {
  id: string
  title: string
  category: EventCategory
  when: string
  startsAt: string | null
  isPublic: boolean
}

// The Host dashboard's own card -- same physical-object visual language
// as Discover's EventCard (same plinth, same pointer tilt, same per-
// category palette) so a host's own event doesn't look like a demoted,
// flatter version of what a guest sees. Footer differs: a host needs
// "open this event" and, for poker, a straight line into the host
// toolkit -- not a join CTA or a guest-avatar stack.
export default function HostEventCard({ data }: { data: HostEventCardData }) {
  const ref = useRef<HTMLDivElement>(null)
  const icon = categoryIcon[data.category]
  const s = cardStyle[data.category]
  const completed = isEventCompleted(data.startsAt)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`)
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
    <div
      ref={ref}
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
          <div className="text-[11px] font-extrabold tracking-wide opacity-70">{data.category.toUpperCase()}</div>
        </div>
        <div className="text-[10.5px] font-extrabold px-2.5 py-1.5 rounded-full shrink-0" style={{ background: s.badgeBg, color: s.badgeColor }}>
          {data.isPublic ? 'Public' : 'Private'}
        </div>
      </div>

      <div className="relative nm-marquee text-[17px] font-extrabold mt-3.5">{data.title}</div>
      <div className="relative flex items-center gap-2 mt-1">
        <div className="text-[12px] font-bold opacity-65">{data.when}</div>
        {completed && (
          <div className="text-[9.5px] font-extrabold px-2 py-[3px] rounded-full shrink-0 bg-black/20">
            Event completed
          </div>
        )}
      </div>

      <div className="relative flex gap-2 mt-4">
        <Link href={`/event/${data.id}`} className="nm-btn flex-1 text-[12px] py-2.5 text-center" style={{ background: s.ctaBg, color: s.ctaColor }}>
          View event
        </Link>
        {data.category === 'poker' && (
          <Link href={`/event/${data.id}/poker`} className="nm-btn nm-btn-gold flex-1 text-[12px] py-2.5 text-center">
            Poker tools →
          </Link>
        )}
      </div>

      {/* Modify is only ever offered before the event happens -- once it's
          over there's nothing left to change, so this row disappears
          instead of linking to a form that would just reject the host. */}
      {!completed && (
        <Link
          href={`/host/${data.id}/edit`}
          className="relative mt-2 text-center text-[11.5px] font-extrabold py-2 rounded-xl border"
          style={{ borderColor: 'rgba(255,255,255,.18)', color: s.color, opacity: 0.85 }}
        >
          Edit details
        </Link>
      )}
    </div>
  )
}
