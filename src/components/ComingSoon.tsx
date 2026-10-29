'use client'

import BackButton from '@/components/BackButton'

// One of these shows per page, picked deterministically from the title so
// it doesn't change on every re-render -- just enough personality that a
// placeholder page doesn't read as a dead end.
const LINES = [
  "Our team is on it — probably arguing about which gradient to use.",
  "Under construction, like most of our New Year’s resolutions.",
  "This page is still shuffling the deck. Deal again soon.",
  "We promise this isn’t just a 404 wearing a nice outfit.",
  "Our builders run on chai and good intentions — give us a bit.",
  "Good nights take planning. So, apparently, does this page.",
  "Still setting the table for this one. Back shortly.",
  "This page RSVP'd but hasn’t shown up yet.",
]

function pickLine(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return LINES[hash % LINES.length]
}

export default function ComingSoon({
  title,
  eyebrow = 'COMING SOON',
  fallbackHref = '/',
}: {
  title: string
  eyebrow?: string
  fallbackHref?: string
}) {
  const line = pickLine(title)

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-20">
        <BackButton fallbackHref={fallbackHref} />

        <div className="flex flex-col items-center text-center mt-14">
          <div className="nm-logo-mark w-14 h-14 flex items-center justify-center text-[22px] font-black mb-6">N</div>
          <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5 text-gold-text">
            {eyebrow}
          </div>
          <h1 className="nm-marquee text-2xl md:text-3xl text-white mb-3">{title}</h1>
          <p className="text-muted text-[14px] font-medium leading-relaxed max-w-sm">{line}</p>
        </div>
      </div>
    </div>
  )
}
