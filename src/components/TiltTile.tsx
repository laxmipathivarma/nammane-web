'use client'

import { useRef } from 'react'

export type TiltTileStyle = {
  bg: string
  color: string
  iconBg: string
  iconStroke?: boolean
  plinth: string
  plinthDark: string
  shadow: string
}

// A single menu tile with the same physical-object feel as the event
// cards (EventCard / HostEventCard): a hard NeoPOP plinth shadow plus a
// pointer-reactive tilt and cursor-tracking shine, factored out here so
// any menu grid in the app (not just the poker hub) can use it instead
// of a flat .nm-field button.
export default function TiltTile({
  onClick,
  icon,
  label,
  hint,
  style,
}: {
  onClick: () => void
  icon: string
  label: string
  hint: string
  style: TiltTileStyle
}) {
  const ref = useRef<HTMLButtonElement>(null)

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
      className="nm-tilt-card rounded-[20px] text-left flex flex-col gap-1.5 !items-start p-4"
      style={{
        background: style.bg,
        color: style.color,
        boxShadow: `${style.shadow}, 0 7px 0 0 ${style.plinth}, 0 7px 0 2px ${style.plinthDark}`,
      }}
    >
      <div className="nm-tilt-shine" />
      <div
        className="relative w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
        style={{ background: style.iconBg }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill={style.iconStroke ? 'none' : 'currentColor'}
          stroke={style.iconStroke ? 'currentColor' : 'none'}
          strokeWidth="1.7"
        >
          <use href={`#${icon}`} />
        </svg>
      </div>
      <span className="relative font-extrabold text-[12.5px] leading-tight mt-1">{label}</span>
      <span className="relative text-[10.5px] font-semibold leading-snug opacity-65">{hint}</span>
    </button>
  )
}
