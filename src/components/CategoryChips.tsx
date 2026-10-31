'use client'

import { useState } from 'react'
import { EVENT_CATEGORIES, categoryLabel, type EventCategory } from '@/lib/eventCardStyle'
import CategoryCard from '@/components/CategoryCard'

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
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {EVENT_CATEGORIES.map((key) => (
        <CategoryCard key={key} category={key} active={active === key} onSelect={() => select(key)} size="sm" />
      ))}
    </div>
  )
}
