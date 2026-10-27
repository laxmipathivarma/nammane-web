import Link from 'next/link'

export type EventCardData = {
  slug: string
  title: string
  category: 'poker' | 'rummy' | 'drinks' | 'dinner' | 'party' | 'other'
  tagLabel: string
  subtitle: string
  priceLabel?: string
  host?: string
  hostInitials?: string
  rating?: string
  seatsLabel?: string
  seatsFilledPct?: number
  ctaLabel: string
}

const categoryHero: Record<EventCardData['category'], string> = {
  poker: 'radial-gradient(70% 120% at 30% 0%, #8b3ffb 0%, #3d1a7a 60%, #16092e 100%)',
  rummy: 'radial-gradient(70% 120% at 70% 0%, #b968ff 0%, #5a1fa8 60%, #1e0d3a 100%)',
  drinks: 'radial-gradient(70% 120% at 30% 0%, #1a8fd1 0%, #0e3f66 60%, #081a2c 100%)',
  dinner: 'radial-gradient(70% 120% at 30% 0%, #e8942c 0%, #7a4a12 60%, #2c1a06 100%)',
  party: 'radial-gradient(70% 120% at 30% 0%, #ff4f9e 0%, #a01866 60%, #2e0c20 100%)',
  other: 'radial-gradient(70% 120% at 30% 0%, #4a4a6e 0%, #241f38 60%, #0c0c18 100%)',
}

const categoryIcon: Record<EventCardData['category'], string> = {
  poker: 'i-spade',
  rummy: 'i-diamond',
  drinks: 'i-martini',
  dinner: 'i-dine',
  party: 'i-party',
  other: 'i-grid',
}

export default function EventCard({ data }: { data: EventCardData }) {
  const icon = categoryIcon[data.category]
  return (
    <Link href={`/event/${data.slug}`} className="nm-card rounded-[20px] overflow-hidden flex flex-col hover:border-gold/30 transition-colors">
      <div className="h-28 relative" style={{ background: categoryHero[data.category] }}>
        <div className="absolute left-4 bottom-2.5 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-extrabold text-gold-text">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <use href={`#${icon}`} />
          </svg>
          {data.tagLabel}
        </div>
        {/* Pricing is host-controlled and hidden by default — never shown unless the host sets it. */}
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="font-extrabold text-[15px] text-white">{data.title}</div>
          {data.rating && (
            <div className="flex items-center gap-0.5 text-gold-text text-xs font-extrabold shrink-0">
              {data.rating}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <use href="#i-star" />
              </svg>
            </div>
          )}
        </div>
        <div className="text-[11.5px] text-muted mt-1 font-semibold">{data.subtitle}</div>

        {data.host && (
          <div className="flex items-center gap-2 mt-2.5">
            <div className="w-5.5 h-5.5 rounded-full bg-ruby text-white text-[10px] font-extrabold flex items-center justify-center" style={{ width: 22, height: 22 }}>
              {data.hostInitials}
            </div>
            <div className="text-[11.5px] font-bold text-[#e4d4ff]">{data.host}</div>
            <svg width="13" height="13" viewBox="0 0 24 24" style={{ marginLeft: -2 }}>
              <use href="#i-check" />
            </svg>
          </div>
        )}

        {typeof data.seatsFilledPct === 'number' && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex-1 h-1.5 rounded-full bg-ink2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${data.seatsFilledPct}%`, background: 'linear-gradient(90deg,#8b3ffb,#ff4f9e)' }}
              />
            </div>
            <div className="text-[10.5px] text-muted font-bold whitespace-nowrap">{data.seatsLabel}</div>
          </div>
        )}

        <div className="nm-btn nm-btn-gold w-full mt-3 py-3 text-[13.5px] text-center">{data.ctaLabel}</div>
      </div>
    </Link>
  )
}
