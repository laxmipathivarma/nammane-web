'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { categoryIcon, categoryLabel, categoryBadgeGradient, categoryImage, type EventCategory } from '@/lib/eventCardStyle'

// Rebuilt to actually match the two Skiper UI references the brief named
// (skiper-ui.com/v1/skiper6 "Hover members" and /v1/skiper35 "Hover
// expand") -- neither ships as installable here (both 404 at the real
// shadcn registry without a paid Skiper UI Pro key; confirmed directly
// against https://skiper-ui.com/registry/skiper6.json, which answers
// `{"error":"Missing license key..."}`), so this is a hand-built
// recreation after visually inspecting both live demos rather than a
// generic "card with a hover glow."
//
// skiper35 is a row of narrow vertical strips that push-expand on hover
// into a wide panel with a large label -- that's the resting/expanded
// *shape* used here. skiper6 is a small thumbnail whose name renders
// enormous on interaction -- that's where the oversized label on expand
// comes from. Combined: small strip at rest ("cards should be smaller"),
// image + a dramatically larger label when hovered/active ("letters
// should be so big"), and the row makes room for the expanded one by
// shrinking its siblings, same push mechanic as skiper35.
//
// Hover only exists on a mouse/trackpad, and this app is used touch-first,
// so touch devices skip the push-expand entirely (useHoverCapable below)
// and just get the compact resting card full-time, with the label already
// sized up from the original build. Tapping still selects either way.
function useHoverCapable() {
  const [capable, setCapable] = useState(false)
  useEffect(() => {
    setCapable(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])
  return capable
}

export default function CategoryCard({
  category,
  active,
  onSelect,
  expanded = false,
  dimmed = false,
  onHoverStart,
  size = 'md',
}: {
  category: EventCategory
  active: boolean
  onSelect: () => void
  expanded?: boolean
  dimmed?: boolean
  onHoverStart?: () => void
  size?: 'sm' | 'md'
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const icon = categoryIcon[category]
  const label = categoryLabel[category]
  const image = categoryImage[category]
  const [a, b] = categoryBadgeGradient[category]
  const hoverCapable = useHoverCapable()
  const isExpanded = hoverCapable && expanded

  const dims =
    size === 'sm'
      ? { rest: 58, open: 208, height: 190, restFont: 10.5, openFont: 26 }
      : { rest: 66, open: 240, height: 216, restFont: 11.5, openFont: 30 }

  // The vertical resting label has to fit the strip's own height ("Get
  // together", "Engagement", "Movie night" are all long) -- a fixed font
  // size clipped the longer names against the card's rounded corners.
  // Shrink proportionally to label length instead of clipping.
  const availableVertical = dims.height - 28
  const restFont = Math.min(dims.restFont, Math.max(7.5, availableVertical / (label.length * 1.22)))

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onSelect}
      onMouseEnter={hoverCapable ? onHoverStart : undefined}
      className="nm-tilt-card relative shrink-0 rounded-[18px] overflow-hidden flex items-end"
      animate={{ width: isExpanded ? dims.open : dims.rest, opacity: dimmed && hoverCapable ? 0.45 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{
        height: dims.height,
        background: image ? '#17132b' : '#f5f3fa',
        boxShadow: active
          ? `0 0 0 2.5px ${a}, 0 10px 26px -8px ${a}99, 0 7px 0 0 rgba(0,0,0,.14)`
          : '0 0 0 1px rgba(0,0,0,.08), 0 5px 0 0 rgba(0,0,0,.12)',
      }}
    >
      <div className="nm-tilt-shine" />
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[5px] z-[3]" style={{ background: `linear-gradient(90deg, ${a}, ${b})` }} />
      )}

      {image ? (
        <>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            animate={{ scale: isExpanded ? 1.12 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${a}, ${b})`, mixBlendMode: 'color', opacity: 0.85 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(0deg, rgba(10,8,22,.94) 0%, rgba(10,8,22,.1) 60%, rgba(10,8,22,0) 78%)' }}
          />

          {/* Resting label: small, rotated vertical -- the skiper35 strip
              treatment (fixed CSS, not animated -- writingMode isn't a
              value framer-motion can interpolate). Crossfades out as the
              card expands. On touch (no hover), it just stays horizontal
              and readable since there's no expanded state to crossfade to. */}
          <motion.span
            className="absolute left-0 right-0 bottom-3 z-[2] text-center font-extrabold uppercase"
            style={{
              color: '#fff',
              fontSize: restFont,
              letterSpacing: '.06em',
              textShadow: '0 1px 4px rgba(0,0,0,.4)',
              writingMode: hoverCapable ? 'vertical-rl' : 'horizontal-tb',
              transform: hoverCapable ? 'rotate(180deg)' : undefined,
            }}
            animate={{ opacity: isExpanded ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>

          {/* Expanded label: the skiper6 "letters should be so big" cue --
              only ever mounted on hover-capable pointers. */}
          {hoverCapable && (
            <motion.span
              className="relative z-[2] px-3 pb-3 font-black leading-[0.95] whitespace-nowrap"
              style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.5)', fontSize: dims.openFont }}
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {label}
            </motion.span>
          )}
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-end pb-3 pt-2">
          <div
            className="relative mb-2 flex items-center justify-center rounded-2xl"
            style={{ width: 34, height: 34, background: active ? `${a}14` : 'rgba(20,14,46,.05)' }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#17132b" stroke="#17132b" strokeWidth="1.3">
              <use href={`#${icon}`} />
            </svg>
          </div>
          <span
            className="px-1 text-center font-extrabold whitespace-nowrap"
            style={{ fontSize: restFont, color: '#17132b', writingMode: hoverCapable ? 'vertical-rl' : 'horizontal-tb' }}
          >
            {label}
          </span>
        </div>
      )}
    </motion.button>
  )
}
