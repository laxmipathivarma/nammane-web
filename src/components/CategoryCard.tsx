'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  categoryIcon,
  categoryLabel,
  categoryBadgeGradient,
  categoryImage,
  type EventCategory,
} from '@/lib/eventCardStyle'

// The category picker used to be tiny circular badges -- "looking so
// bad" per feedback, wanting bigger cards with the same pointer-tilt
// mechanic as EventCard/TiltTile. It then moved to plain white cards with
// a black line-icon. Now each category gets a real illustration
// (categoryImage) instead of a line-icon, tinted with that category's own
// brand gradient (categoryBadgeGradient) via a color-blend overlay so the
// photos read as one cohesive, on-brand set rather than stock art pasted
// in -- and the cards are sized up a good deal so the art (and the
// difference between categories) is actually easy to see and tap.
//
// On top of that, a hover layer modeled on Skiper UI's "hover members"
// component (skiper-ui.com/v1/skiper6): a soft cursor-follow glow in the
// category's own brand color, a slow photo zoom, and the label brightening
// with a gradient underline growing in underneath it. skiper6 itself is a
// paid/licensed package (its registry 404s without a Pro key -- confirmed
// by hand), so this is a from-scratch recreation of the same feel with
// framer-motion (already a project dependency) rather than the real thing.
// The label stays visible at rest (not hidden-until-hover like skiper6's
// original) because this app is used touch-first -- hover never fires on a
// phone, so hiding the name behind hover would make it permanently
// invisible there. The spotlight/zoom are pointer-only enhancements that
// are simply inert on touch (no pointermove, no hover) rather than
// something that has to be disabled for it.
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
  const image = categoryImage[category]
  const [a, b] = categoryBadgeGradient[category]

  // Spotlight position, 0-1 within the card, smoothed with a spring so it
  // trails the pointer like skiper6's cursor-follower rather than snapping
  // to it. Starts centered so the very first hover frame doesn't jump in
  // from a corner.
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 220, damping: 24, mass: 0.4 })
  const spotlightLeft = useTransform(sx, (v) => `${v * 100}%`)
  const spotlightTop = useTransform(sy, (v) => `${v * 100}%`)

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
    mx.set(px)
    my.set(py)
  }
  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
    mx.set(0.5)
    my.set(0.5)
  }

  const dims =
    size === 'sm'
      ? { card: 136, icon: 36, iconBox: 46, font: 12.5 }
      : { card: 160, icon: 40, iconBox: 52, font: 13.5 }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="nm-tilt-card relative shrink-0 rounded-[22px] flex flex-col items-center justify-end overflow-hidden"
      style={{
        width: dims.card,
        height: dims.card,
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
          {/* Illustration, tinted with the category's own brand gradient
              (color blend) so every card -- whatever the source photo's
              original palette -- reads as part of the same NamMane set.
              A slow zoom on hover is the skiper6-style "wake up" cue. */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${a}, ${b})`, mixBlendMode: 'color', opacity: 0.85 }}
          />
          {/* Cursor-follow spotlight in the category's own brand color --
              the Skiper "hover members" cursor-follower, recreated without
              the paid package. Pointer-only: with no pointermove on touch,
              mx/my just sit at their centered default and this stays
              invisible (opacity only turns on via whileHover="hover",
              which touch taps don't trigger as a *held* state). */}
          <motion.div
            className="pointer-events-none absolute h-[85%] w-[85%] rounded-full blur-2xl"
            style={{
              left: spotlightLeft,
              top: spotlightTop,
              x: '-50%',
              y: '-50%',
              background: `radial-gradient(circle, ${a}99 0%, ${b}00 70%)`,
              mixBlendMode: 'screen',
            }}
            variants={{ rest: { opacity: 0 }, hover: { opacity: 0.8 } }}
            transition={{ duration: 0.25 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(0deg, rgba(10,8,22,.92) 0%, rgba(10,8,22,.15) 55%, rgba(10,8,22,0) 75%)' }}
          />
          <motion.span
            className="relative z-[2] px-2.5 pb-2.5 text-center font-extrabold leading-tight whitespace-nowrap"
            style={{ fontSize: dims.font, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.4)' }}
            variants={{ rest: { y: 0 }, hover: { y: -3 } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {label}
          </motion.span>
          <motion.div
            className="relative z-[2] mb-2.5 h-[2.5px] rounded-full"
            style={{ background: `linear-gradient(90deg, ${a}, ${b})` }}
            variants={{ rest: { width: 0, opacity: 0 }, hover: { width: 22, opacity: 1 } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </>
      ) : (
        <>
          <div className="flex-1" />
          <div
            className="relative flex items-center justify-center rounded-2xl"
            style={{ width: dims.iconBox, height: dims.iconBox, background: active ? `${a}14` : 'rgba(20,14,46,.05)' }}
          >
            <svg width={dims.icon} height={dims.icon} viewBox="0 0 24 24" fill="#17132b" stroke="#17132b" strokeWidth="1.3">
              <use href={`#${icon}`} />
            </svg>
          </div>
          <span className="relative pb-3 pt-2 text-[10.5px] font-extrabold whitespace-nowrap" style={{ color: '#17132b' }}>
            {label}
          </span>
        </>
      )}
    </motion.button>
  )
}
