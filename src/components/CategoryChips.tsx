'use client'

import { useState } from 'react'
import {
  EVENT_CATEGORIES,
  categoryLabel,
  categoryEmoji,
  categoryBadgeGradient,
  type EventCategory,
} from '@/lib/eventCardStyle'

// Back-compat: a couple of pages still do CATEGORIES.find(c => c.key === x)?.label
// to show the active filter's name. Derived from the shared category metadata
// so there's one source of truth instead of a second hardcoded list.
export const CATEGORIES = EVENT_CATEGORIES.map((key) => ({ key, label: categoryLabel[key] }))

export default function CategoryChips({
  onChange,
  initial = 'poker',
}: {
  onChange?: (key: EventCategory) => void
  initial?: EventCategory
}) {
  const [active, setActive] = useState<EventCategory>(initial)

  const select = (key: EventCategory) => {
    setActive(key)
    onChange?.(key)
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {EVENT_CATEGORIES.map((key) => {
        const isActive = active === key
        const [c1, c2] = categoryBadgeGradient[key]
        return (
          <button
            key={key}
            onClick={() => select(key)}
            className="shrink-0 flex flex-col items-center gap-1 pt-2 pb-1.5 px-2.5 rounded-2xl transition-transform duration-150 hover:-translate-y-0.5"
            style={{
              background: isActive ? 'linear-gradient(160deg,#241a3d,#120f26)' : 'rgba(255,255,255,.05)',
              border: isActive ? '1px solid rgba(255,79,158,.5)' : '1px solid rgba(255,255,255,.08)',
              boxShadow: isActive ? '0 6px 16px rgba(255,79,158,.22)' : 'none',
            }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 34,
                height: 34,
                fontSize: 17,
                lineHeight: 1,
                background: `linear-gradient(155deg, ${c1}, ${c2})`,
                boxShadow:
                  'inset -3px -4px 7px rgba(10,8,28,.45), inset 2px 3px 5px rgba(255,255,255,.4), 0 5px 10px rgba(0,0,0,.3)',
              }}
            >
              {categoryEmoji[key]}
            </span>
            <span className={`text-[10px] font-bold whitespace-nowrap ${isActive ? 'text-white' : 'text-muted'}`}>
              {categoryLabel[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
