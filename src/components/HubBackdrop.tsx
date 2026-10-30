'use client'

import { useRef } from 'react'
import { cardStyle, categoryIcon, type EventCategory } from '@/lib/eventCardStyle'

// Soft color blooms scattered per category, built from that category's
// own accent colors -- the same bokeh device the landing hero uses
// (WebAppHero3D.tsx's <Stars/> + drop-shadowed planets), not the flat
// two-stop gradient the first pass of this backdrop used.
// Only poker (and the original 5 siblings) have bespoke orb layouts --
// the rest fall back to `other`'s via the lookup below instead of
// needing one of these hand-placed per new category.
const ORBS: Partial<Record<EventCategory, { color: string; style: React.CSSProperties }[]>> = {
  poker: [
    { color: '#8b3ffb', style: { top: '-10%', left: '-8%', width: 300, height: 300 } },
    { color: '#ff4f9e', style: { top: '22%', right: '-10%', width: 240, height: 240 } },
    { color: '#4cc9f0', style: { bottom: '-8%', left: '22%', width: 220, height: 220 } },
  ],
  rummy: [
    { color: '#c23ffb', style: { top: '-8%', left: '-6%', width: 280, height: 280 } },
    { color: '#8b3ffb', style: { bottom: '-8%', right: '-8%', width: 260, height: 260 } },
  ],
  drinks: [
    { color: '#4cc9f0', style: { top: '-8%', right: '-8%', width: 280, height: 280 } },
    { color: '#1a8fd1', style: { bottom: '-6%', left: '-6%', width: 240, height: 240 } },
  ],
  dinner: [
    { color: '#e8942c', style: { top: '-8%', left: '-8%', width: 280, height: 280 } },
    { color: '#ff8fd1', style: { bottom: '-6%', right: '-6%', width: 220, height: 220 } },
  ],
  party: [
    { color: '#ff4f9e', style: { top: '-8%', right: '-8%', width: 280, height: 280 } },
    { color: '#c23ffb', style: { bottom: '-6%', left: '-6%', width: 240, height: 240 } },
  ],
  other: [{ color: '#8b3ffb', style: { top: '-8%', left: '-8%', width: 260, height: 260 } }],
}

function Stars({ color }: { color: string }) {
  const stars = useRef<{ top: number; left: number; size: number; delay: number }[]>([])
  if (stars.current.length === 0) {
    for (let i = 0; i < 36; i++) {
      stars.current.push({ top: Math.random() * 100, left: Math.random() * 100, size: 0.8 + Math.random() * 1.6, delay: Math.random() * 3 })
    }
  }
  return (
    <>
      {stars.current.map((s, i) => (
        <span
          key={i}
          className="nm2-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: i % 3 === 0 ? color : '#fff',
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  )
}

// Every host-tools hub rests on its own category-themed backdrop
// instead of the one generic .nm-bg the rest of the app uses: a dark
// glowing scene pulled from the landing page's own nm2-* design system
// (orbs, twinkle stars, a huge soft-glow suit mark slowly turning in
// the dark) rather than a flat gradient with a couple of thin icon
// outlines. Only Poker has a built hub today; the rest are ready for
// when their hubs ship.
export default function HubBackdrop({ category }: { category: EventCategory }) {
  const s = cardStyle[category]
  const icon = categoryIcon[category]
  const orbs = ORBS[category] ?? ORBS.other!

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none nm-bg-${category}`} aria-hidden="true">
      <Stars color={s.plinth} />

      {orbs.map((o, i) => (
        <div key={i} className="nm-amb-orb nm2-bob" style={{ background: o.color, opacity: 0.4, animationDelay: `${i * 0.6}s`, ...o.style }} />
      ))}

      {/* A huge, soft, glowing suit mark turning very slowly in the dark
          -- like a single giant chip catching a spotlight -- instead of
          the thin scattered outline icons the first pass used. */}
      <div
        className="nm-amb-spin-slow absolute"
        style={{ top: '38%', left: '50%', width: 520, height: 520, marginLeft: -260, marginTop: -260, opacity: 0.1 }}
      >
        <svg viewBox="0 0 24 24" fill={s.plinth} style={{ filter: `drop-shadow(0 0 60px ${s.plinth})` }}>
          <use href={`#${icon}`} />
        </svg>
      </div>
    </div>
  )
}
