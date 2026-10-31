'use client'

import { useRef } from 'react'
import { categoryIcon, categoryLabel, categoryBadgeGradient, type EventCategory } from '@/lib/eventCardStyle'

// The category picker used to be tiny circular badges -- "looking so
// bad" per feedback, wanting bigger cards with the same pointer-tilt
// mechanic as EventCard/TiltTile, but with a plain white card face and
// a black line-icon per category (not a colored gradient) so the
// category's own accent color only shows up as a selection cue, not as
// decoration competing with the dark app chrome around it.
export default function CategoryCard({
  category,
  active,
  onSelect,
  size = 'md',
}: {
  category: EventCategory
  active: boolean
  onSelect: () => void
  size?: 'sm' | 'md'
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const icon = categoryIcon[category]
  const label = categoryLabel[category]
  const [a, b] = categoryBadgeGradient[category]

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }

  const dims = size === 'sm' ? { card: 92, icon: 36, iconBox: 46 } : { card: 108, icon: 40, iconBox: 52 }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="nm-tilt-card relative shrink-0 rounded-[20px] flex flex-col items-center justify-center gap-2 overflow-hidden"
      style={{
        width: dims.card,
        height: dims.card,
        background: '#f5f3fa',
        boxShadow: active
          ? `0 0 0 2.5px ${a}, 0 10px 24px -8px ${a}99, 0 7px 0 0 rgba(0,0,0,.14)`
          : '0 0 0 1px rgba(0,0,0,.05), 0 5px 0 0 rgba(0,0,0,.1)',
      }}
    >
      <div className="nm-tilt-shine" />
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${a}, ${b})` }} />
      )}
      <div
        className="relative flex items-center justify-center rounded-2xl"
        style={{ width: dims.iconBox, height: dims.iconBox, background: active ? `${a}14` : 'rgba(20,14,46,.05)' }}
      >
        <svg width={dims.icon} height={dims.icon} viewBox="0 0 24 24" fill="#17132b" stroke="#17132b" strokeWidth="1.3">
          <use href={`#${icon}`} />
        </svg>
      </div>
      <span className="relative text-[10.5px] font-extrabold whitespace-nowrap" style={{ color: '#17132b' }}>
        {label}
      </span>
    </button>
  )
}
