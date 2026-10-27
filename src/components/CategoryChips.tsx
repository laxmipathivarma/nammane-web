'use client'

import { useState } from 'react'

export const CATEGORIES = [
  { key: 'poker', label: 'Poker', icon: 'i-spade', fill: true },
  { key: 'rummy', label: 'Rummy', icon: 'i-diamond', fill: true },
  { key: 'drinks', label: 'Drinks', icon: 'i-martini', fill: false },
  { key: 'dinner', label: 'Dinner', icon: 'i-dine', fill: false },
  { key: 'party', label: 'Party', icon: 'i-party', fill: false },
  { key: 'other', label: 'Other', icon: 'i-grid', fill: false },
] as const

export default function CategoryChips({
  onChange,
}: {
  onChange?: (key: string) => void
}) {
  const [active, setActive] = useState<string>('poker')

  const select = (key: string) => {
    setActive(key)
    onChange?.(key)
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((c) => {
        const isActive = active === c.key
        return (
          <button
            key={c.key}
            onClick={() => select(c.key)}
            className="nm-chip px-4 py-2.5"
            style={
              isActive
                ? {
                    background: 'linear-gradient(180deg,#c9707a,#b23a4a)',
                    color: '#1c1210',
                    boxShadow: '0 0 0 2px rgba(178,58,74,.18),0 6px 14px rgba(178,58,74,.18)',
                  }
                : { background: '#1c160e', color: '#e8ddc8' }
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isActive ? '#1c1210' : c.fill ? '#e8ddc8' : 'none'}
              stroke={isActive ? 'none' : c.fill ? 'none' : '#e8ddc8'}
            >
              <use href={`#${c.icon}`} />
            </svg>
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
