import { cardStyle, type EventCategory } from '@/lib/eventCardStyle'

// Large, mostly-off-screen glyphs scattered behind a hub's content --
// a scatter of face-down suits across a card table, not a neat grid --
// at low enough opacity that they read as texture, never compete with
// the real content sitting on top of them.
const WATERMARKS: Record<EventCategory, { icon: string; style: React.CSSProperties }[]> = {
  poker: [
    { icon: 'i-spade', style: { top: '-6%', left: '-10%', width: 220, height: 220, transform: 'rotate(-18deg)' } },
    { icon: 'i-heart', style: { top: '8%', right: '-12%', width: 180, height: 180, transform: 'rotate(14deg)' } },
    { icon: 'i-diamond', style: { bottom: '6%', left: '-8%', width: 170, height: 170, transform: 'rotate(10deg)' } },
    { icon: 'i-club', style: { bottom: '-8%', right: '-6%', width: 230, height: 230, transform: 'rotate(-10deg)' } },
  ],
  rummy: [
    { icon: 'i-diamond', style: { top: '-4%', left: '-8%', width: 210, height: 210, transform: 'rotate(-14deg)' } },
    { icon: 'i-club', style: { bottom: '-6%', right: '-8%', width: 220, height: 220, transform: 'rotate(12deg)' } },
  ],
  drinks: [{ icon: 'i-martini', style: { top: '-4%', right: '-10%', width: 240, height: 240, transform: 'rotate(10deg)' } }],
  dinner: [{ icon: 'i-dine', style: { bottom: '-6%', left: '-8%', width: 230, height: 230, transform: 'rotate(-12deg)' } }],
  party: [{ icon: 'i-party', style: { top: '-6%', right: '-10%', width: 230, height: 230, transform: 'rotate(14deg)' } }],
  other: [{ icon: 'i-grid', style: { bottom: '-6%', right: '-8%', width: 200, height: 200, transform: 'rotate(8deg)' } }],
}

// Every host-tools hub rests on its own category-themed backdrop
// instead of the one generic .nm-bg the rest of the app uses -- see
// the .nm-bg-<category> rules in globals.css for why. This component
// is the whole backdrop: the themed glow plus the scattered watermark
// glyphs, fixed behind the page so it doesn't scroll with content.
export default function HubBackdrop({ category }: { category: EventCategory }) {
  const s = cardStyle[category]
  const marks = WATERMARKS[category]
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none nm-bg-${category}`} aria-hidden="true">
      {marks.map((m, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ position: 'absolute', color: s.plinth, opacity: 0.1, ...m.style }}
        >
          <use href={`#${m.icon}`} />
        </svg>
      ))}
    </div>
  )
}
