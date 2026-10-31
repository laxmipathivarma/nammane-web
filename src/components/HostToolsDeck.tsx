'use client'

import { useEffect, useState } from 'react'

// A "fan deck" version of the Host Tools menu, built on the exact same
// mechanic + CSS classes as the marketing site's CategoryDeck ("Deal
// yourself in"): narrow collapsed strips that flex open on hover (tap on
// mobile), where the active one shows the full icon/label/hint. Reuses
// .nm2-deck/.nm2-deck-enter/.nm2-reveal from globals.css, which already
// collapse the row into a stacked, swipeable vertical list under 760px --
// exactly this app's own phone-width layout -- instead of a cramped
// horizontal strip.
//
// TiltTile's subtle pointer-tilt (a few degrees of rotation) reads as
// "basically static" at a glance; this is the deliberately bigger,
// obviously-animated alternative for this one menu.
export type HostToolsDeckItem = {
  key: string
  icon: string
  label: string
  hint: string
  accent: readonly [string, string]
  onOpen: () => void
}

export default function HostToolsDeck({ items }: { items: HostToolsDeckItem[] }) {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="nm2-deck flex gap-2 rounded-[22px] overflow-hidden" style={{ height: 'min(60vh, 460px)' }}>
      {items.map((item, i) => {
        const isActive = i === active
        const [a, b] = item.accent
        return (
          <div
            key={item.key}
            onMouseEnter={() => setActive(i)}
            onClick={() => (isActive ? item.onOpen() : setActive(i))}
            className={`relative cursor-pointer rounded-[18px] overflow-hidden nm2-card-${isActive ? 'active' : 'inactive'} ${
              mounted ? 'nm2-deck-enter' : 'opacity-0'
            }`}
            style={{
              flex: isActive ? 5 : 1,
              minWidth: isActive ? undefined : 48,
              transition: 'flex .7s cubic-bezier(.77,0,.18,1)',
              animationDelay: `${i * 0.06}s`,
              background: `linear-gradient(165deg, ${a}, ${b})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: isActive ? 'linear-gradient(0deg, rgba(5,5,15,.78) 0%, rgba(5,5,15,.1) 55%, transparent 80%)' : 'linear-gradient(0deg, rgba(5,5,15,.4), transparent 60%)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.3), transparent 45%)' }} />

            {isActive ? (
              <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
                <div
                  className="nm2-reveal w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shrink-0"
                  style={{
                    background: 'rgba(255,255,255,.22)',
                    boxShadow: 'inset -4px -5px 9px rgba(10,8,28,.4), inset 3px 4px 7px rgba(255,255,255,.45), 0 8px 18px rgba(0,0,0,.3)',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
                    <use href={`#${item.icon}`} />
                  </svg>
                </div>
                <div className="nm2-reveal text-white font-extrabold text-[17px] leading-tight mb-1" style={{ animationDelay: '.1s' }}>
                  {item.label}
                </div>
                <div className="nm2-reveal text-white/75 text-[12px] font-semibold mb-3.5" style={{ animationDelay: '.16s' }}>
                  {item.hint}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    item.onOpen()
                  }}
                  className="nm2-reveal inline-flex items-center gap-1.5 rounded-full bg-white text-[12px] font-bold px-4 py-2.5 text-[#1c1240]"
                  style={{ animationDelay: '.22s' }}
                >
                  Open
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c1240" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  opacity={0.85}
                  className="absolute left-1/2 top-3 -translate-x-1/2"
                >
                  <use href={`#${item.icon}`} />
                </svg>
                <span className="nm2-card-name text-white/85 text-[10.5px] font-extrabold">{item.label}</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
