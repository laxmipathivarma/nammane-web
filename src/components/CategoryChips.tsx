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
                    background: 'linear-gradient(120deg,#8b3ffb,#ff4f9e)',
                    color: '#fff',
                    border: '1.5px solid #1b0a3d',
                    boxShadow: '0 3px 0 0 #4a1397, 0 3px 0 2px #1b0a3d',
                  }
                : { background: 'rgba(255,255,255,.06)', color: '#e4d4ff' }
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isActive ? '#fff' : c.fill ? '#e4d4ff' : 'none'}
              stroke={isActive ? 'none' : c.fill ? 'none' : '#e4d4ff'}
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
