import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EVENTS, categoryHero, categoryIcon } from '@/lib/sampleEvents'

export function generateStaticParams() {
  return Object.keys(EVENTS).map((slug) => ({ slug }))
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = EVENTS[params.slug]
  if (!event) notFound()

  const icon = categoryIcon[event.category]

  return (
    <div className="nm-bg min-h-screen text-[#f5efe3]">
      {/* hero */}
      <div className="relative h-[260px] md:h-[320px] overflow-hidden" style={{ background: categoryHero[event.category] }}>
        <div
          className="absolute inset-0"
          style={{ background: 'repeating-radial-gradient(circle at 50% 110%, rgba(0,0,0,0) 0 120px, rgba(0,0,0,.25) 121px 123px)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-5 flex items-center justify-between">
          <Link href="/discover" className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" fill="none">
              <use href="#i-back" />
            </svg>
          </Link>
          <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center" aria-label="Share event">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" fill="none">
              <use href="#i-share" />
            </svg>
          </button>
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute left-5 md:left-auto md:right-auto bottom-3.5 bg-gradient-to-b from-[#c9707a] to-[#b23a4a] text-[#1c1210] font-extrabold text-[11.5px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 max-w-[calc(100%-40px)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1c1210">
            <use href={`#${icon}`} />
          </svg>
          {event.tagLabel}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pb-32 pt-5">
        <h1 className="nm-marquee text-2xl md:text-3xl text-white">{event.title}</h1>
        <div className="flex items-center gap-1.5 mt-1.5 text-[12.5px] text-gold-text font-extrabold">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <use href="#i-star" />
          </svg>
          {event.rating}{' '}
          <span className="text-muted font-semibold">
            ({event.reviewCount} reviews) · {event.eventsHosted} events hosted
          </span>
        </div>

        {/* host card */}
        <div className="nm-card rounded-2xl p-3.5 flex items-center gap-3 mt-4">
          <div className="w-11 h-11 rounded-full bg-ruby text-white font-extrabold text-sm flex items-center justify-center shrink-0">
            {event.host.initials}
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[14px] flex items-center gap-1.5">
              {event.host.name}
              <svg width="13" height="13" viewBox="0 0 24 24">
                <use href="#i-check" />
              </svg>
            </div>
            <div className="text-[11px] text-muted font-semibold mt-0.5">
              Host since {event.host.since} · ID verified
            </div>
          </div>
          <button className="nm-btn bg-ink2 text-gold-text border border-gold/50 px-3.5 py-2 text-[11.5px]">
            Message
          </button>
        </div>

        {/* details grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="nm-card rounded-2xl p-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
              <use href="#i-clock" />
            </svg>
            <div className="text-[11px] text-muted font-bold mt-1.5">When</div>
            <div className="text-[13px] font-extrabold mt-0.5">{event.schedule}</div>
          </div>
          <div className="nm-card rounded-2xl p-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
              <use href="#i-pin" />
            </svg>
            <div className="text-[11px] text-muted font-bold mt-1.5">{event.area}</div>
            <div className="text-[13px] font-extrabold mt-0.5">Exact spot shown after approval</div>
          </div>
          <div className="nm-card rounded-2xl p-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
              <use href="#i-seat" />
            </svg>
            <div className="text-[11px] text-muted font-bold mt-1.5">Seats</div>
            <div className="text-[13px] font-extrabold mt-0.5">{event.seatsLabel}</div>
          </div>
          <div className="nm-card rounded-2xl p-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
              <use href={`#${icon}`} />
            </svg>
            <div className="text-[11px] text-muted font-bold mt-1.5">Format</div>
            <div className="text-[13px] font-extrabold mt-0.5">{event.format}</div>
          </div>
        </div>

        {/* who's at the table */}
        <div className="mt-5">
          <div className="text-[12px] font-extrabold text-[#e8ddc8] mb-2">Who&apos;s going</div>
          <div className="flex items-center">
            {event.guests.map((g, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-ink"
                style={{ background: g.color, marginLeft: i === 0 ? 0 : -8 }}
              >
                {g.initials}
              </div>
            ))}
            <div className="ml-2.5 text-[11.5px] text-muted font-semibold">
              {event.seatsLeft} seat{event.seatsLeft === 1 ? '' : 's'} left · host approves requests
            </div>
          </div>
        </div>

        {/* house rules */}
        <div className="mt-5">
          <div className="text-[12px] font-extrabold text-[#e8ddc8] mb-2">House rules</div>
          <div className="nm-card rounded-2xl p-3.5 text-[12.5px] text-[#d9cdb8] leading-relaxed font-semibold">
            {event.houseRules}
          </div>
        </div>

        {event.priceLabel && (
          <div className="mt-5 nm-card rounded-2xl p-3.5 flex items-center justify-between">
            <div className="text-[12.5px] font-bold text-muted">Buy-in · set by host</div>
            <div className="text-[15px] font-extrabold text-gold-text">{event.priceLabel}</div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 text-[11px] text-muted2 font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="#8a7d68" fill="none">
            <use href="#i-shield" />
          </svg>
          Real-money wagering is disabled pending legal &amp; app-store review
        </div>
      </div>

      {/* sticky request bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent pt-6 pb-5 px-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 text-[12.5px] text-muted font-semibold">
            {event.seatsLeft} seat{event.seatsLeft === 1 ? '' : 's'} left for {event.title}
          </div>
          <button className="nm-btn nm-btn-gold px-7 py-3.5 text-[13.5px]">Request to join</button>
        </div>
      </div>
    </div>
  )
}
