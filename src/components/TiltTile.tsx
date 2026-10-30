'use client'

import { useRef } from 'react'

// A menu tile for a hub's own utility screens (poker's host-tools
// menu): dark neon glass (.nm-hub-tile, the same visual family as the
// landing hero -- see HubBackdrop.tsx) with a gradient icon badge in
// the tile's own accent color, plus the same pointer-tilt + shine
// mechanic as EventCard/HostEventCard so it still feels like a
// physical object, just one lit from within instead of a pastel card
// sitting on a dark page.
export default function TiltTile({
  onClick,
  icon,
  label,
  hint,
  accent,
}: {
  onClick: () => void
  icon: string
  label: string
  hint: string
  accent: readonly [string, string]
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [a, b] = accent

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="nm-tilt-card nm-hub-tile rounded-[20px] text-left flex flex-col gap-1.5 !items-start p-4"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,.04), 0 16px 34px -14px ${a}66` }}
    >
      <div className="nm-tilt-shine" />

      <div className="relative flex items-start justify-between w-full">
        <div
          className="w-10 h-10 rounded-[13px] flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${a}, ${b})`, boxShadow: `0 6px 18px -4px ${a}99, 0 0 0 1px rgba(255,255,255,.14) inset` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <use href={`#${icon}`} />
          </svg>
        </div>
        <svg className="nm-hub-tile-arrow mt-2.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#cfc9e6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      <span className="relative font-extrabold text-[12.5px] leading-tight text-white mt-1.5">{label}</span>
      <span className="relative text-[10.5px] font-semibold leading-snug" style={{ color: 'var(--nm-text-meta)' }}>
        {hint}
      </span>
    </button>
  )
}
