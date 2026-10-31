'use client'

import { useState } from 'react'
import { WheelCarousel, type WheelCarouselItem } from '@/components/ui/wheel-carousel'

export type HostToolsWheelItem = {
  key: string
  label: string
  hint: string
  glyph: string // raw SVG markup (paths/shapes), centered on (0,0), ~80px radius
  accent: readonly [string, string]
  onOpen: () => void
}

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// WheelCarousel (componentry.dev) expects each item to carry a photo --
// it was built for a portfolio/project picker, not an icon menu. There's
// no per-tool photography for a poker host-tools menu, so each "photo" is
// a small generated gradient-plus-glyph SVG instead of an actual image --
// the component itself doesn't know the difference, and the result still
// gets its real crossfade-on-select behavior.
function toolPhoto(accent: readonly [string, string], glyph: string) {
  const [a, b] = accent
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<rect width="480" height="640" fill="url(#g)"/>` +
      `<g transform="translate(240,320)" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>` +
      `</svg>`
  )
}

export default function HostToolsWheel({ items }: { items: HostToolsWheelItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselItems: WheelCarouselItem[] = items.map((item) => ({
    label: item.label,
    image: toolPhoto(item.accent, item.glyph),
    imageAlt: item.label,
  }))

  const active = items[activeIndex]

  return (
    <div className="rounded-[26px] overflow-hidden" style={{ background: '#120f26', border: '1px solid rgba(255,255,255,.08)' }}>
      <WheelCarousel
        items={carouselItems}
        mode="custom"
        background="#120f26"
        panelColor="#1c1836"
        textColor="rgba(228,212,255,.45)"
        selectedColor="#ffffff"
        markerColor="#ff4f9e"
        photoWidth={38}
        photoAspect="3/4"
        photoRadius={20}
        contentWidth={520}
        visibleItems={4}
        spacing={16}
        radius={130}
        className="!h-[300px] !min-h-0"
        activeIndex={activeIndex}
        onActiveChange={(_item, index) => setActiveIndex(index)}
        itemClassName="!text-[13.5px] sm:!text-[15px] !font-bold !uppercase !tracking-[.04em]"
      />

      {active && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold text-white truncate">{active.label}</div>
            <div className="text-[11.5px] font-semibold text-[#cfc9e6] truncate">{active.hint}</div>
          </div>
          <button
            type="button"
            onClick={active.onOpen}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white text-[12px] font-bold px-4 py-2.5 text-[#1c1240]"
          >
            Open
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c1240" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
      <div className="px-5 pb-3 text-center text-[10.5px] font-semibold text-[#8b84a8]">Drag or scroll to browse, tap Open to go</div>
    </div>
  )
}
