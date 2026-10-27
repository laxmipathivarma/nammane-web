export type EventCardData = {
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
  poker: 'radial-gradient(70% 120% at 30% 0%, #1e6e4a 0%, #0d3a27 60%, #082318 100%)',
  rummy: 'radial-gradient(70% 120% at 70% 0%, #4a2e1a 0%, #1f140d 60%, #120d09 100%)',
  drinks: 'radial-gradient(70% 120% at 30% 0%, #5a3414 0%, #2e1a0a 60%, #170d05 100%)',
  dinner: 'radial-gradient(70% 120% at 30% 0%, #5c1620 0%, #2e0e13 60%, #170709 100%)',
  party: 'radial-gradient(70% 120% at 30% 0%, #8a2332 0%, #4a1a1e 60%, #180c0c 100%)',
  other: 'radial-gradient(70% 120% at 30% 0%, #2c2c2c 0%, #181818 60%, #0c0c0c 100%)',
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
    <div className="nm-card rounded-[20px] overflow-hidden flex flex-col">
      <div className="h-28 relative" style={{ background: categoryHero[data.category] }}>
        <div className="absolute left-4 bottom-2.5 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-extrabold text-gold-text">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <use href={`#${icon}`} />
          </svg>
          {data.tagLabel}
        </div>
        {data.priceLabel && (
          <div className="absolute right-3 top-2.5 bg-gradient-to-b from-gold-light to-gold-dark text-[#241607] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
            {data.priceLabel}
          </div>
        )}
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
            <div className="text-[11.5px] font-bold text-[#e8ddc8]">{data.host}</div>
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
                style={{ width: `${data.seatsFilledPct}%`, background: 'linear-gradient(90deg,#b23a4a,#cda858)' }}
              />
            </div>
            <div className="text-[10.5px] text-muted font-bold whitespace-nowrap">{data.seatsLabel}</div>
          </div>
        )}

        <button className="nm-btn nm-btn-gold w-full mt-3 py-3 text-[13.5px]">{data.ctaLabel}</button>
      </div>
    </div>
  )
}
