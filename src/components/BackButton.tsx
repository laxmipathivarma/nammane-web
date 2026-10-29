'use client'

import { useRouter } from 'next/navigation'

// A plain router.back() can land nowhere (empty tab history, a shared
// link opened fresh) -- fall back to a sensible destination when there's
// no real history to go back to.
export default function BackButton({
  label = 'Back',
  fallbackHref = '/',
  className = '',
  variant = 'text',
}: {
  label?: string
  fallbackHref?: string
  className?: string
  // 'text' -- "< Back" link, for the top of a regular page.
  // 'circle' -- icon-only glass circle, for overlaying a hero image.
  variant?: 'text' | 'circle'
}) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  if (variant === 'circle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={`nm-glass w-9 h-9 rounded-full flex items-center justify-center ${className}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-[13px] font-bold text-muted hover:text-gold-text transition-colors ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  )
}
