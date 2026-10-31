'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EVENT_CATEGORIES } from '@/lib/eventCardStyle'
import CategoryCard from '@/components/CategoryCard'
import BackButton from '@/components/BackButton'
import { useAuth } from '@/lib/AuthProvider'

const DEFAULT_RADIUS_KM = 25

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [category, setCategory] = useState('poker')
  const [hoveredCategory, setHoveredCategory] = useState<(typeof EVENT_CATEGORIES)[number] | null>(null)
  const [requireApproval, setRequireApproval] = useState(true)
  // Poker games are invite-only home games by nature (WhatsApp invites +
  // guest approvals, not strangers browsing Discover) -- default private
  // so publishing a poker event never blocks on a location-permission
  // prompt the host has no reason to grant. Still a one-tap toggle below
  // for anyone who does want their event discoverable.
  const [isPublic, setIsPublic] = useState(false)
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [format, setFormat] = useState('')
  const [capacity, setCapacity] = useState('6')
  const [price, setPrice] = useState('')
  const [venue, setVenue] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The host's device location -- used both as the event's discovery
  // anchor for public events (so Discover can filter by distance) and
  // just stored as-is for private ones (harmless, and saves asking twice
  // if a host later flips an event from private to public).
  const getLocation = (): Promise<{ lat: number; lng: number } | null> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null)
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 8000 }
      )
    })

  const handlePublish = async () => {
    if (!user) {
      setError('Please sign in to publish an event.')
      return
    }
    if (!title.trim()) {
      setError('Give your event a title first.')
      return
    }
    if (isPublic && (radiusKm < 1 || radiusKm > 100)) {
      setError('Pick a radius between 1 and 100 km for a public event.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const loc = await getLocation()
      if (isPublic && !loc) {
        setError(
          'Could not get your location -- allow location access in your browser to publish a public event (switch to Private to skip this).'
        )
        setSubmitting(false)
        return
      }

      const startsAt = date && time ? new Date(`${date}T${time}`).toISOString() : null

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description: format || null,
          starts_at: startsAt,
          address: venue || null,
          capacity: capacity ? Number(capacity) : null,
          contribution_amount: price ? Number(price) : null,
          is_public: isPublic,
          radius_km: isPublic ? radiusKm : null,
          lat: loc?.lat ?? null,
          lng: loc?.lng ?? null,
          notes: notes || null,
          require_approval: requireApproval,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Could not publish your event.')
        setSubmitting(false)
        return
      }

      // Poker events get a ledger (buy-ins, cash-outs, settle-up) -- take
      // the host straight there instead of back to Discover.
      if (category === 'poker' && json.event?.id) {
        router.push(`/event/${json.event.id}/poker`)
      } else {
        router.push('/discover')
      }
    } catch (e) {
      console.error(e)
      setError('Something went wrong publishing your event.')
      setSubmitting(false)
    }
  }

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-5 pt-7 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <BackButton
            variant="circle"
            fallbackHref="/discover"
            label="Back"
            className="!w-8 !h-8 bg-ink2 border-0"
          />
          <h1 className="nm-marquee text-xl text-gold-text">Host · New Event</h1>
        </div>

        <label className="nm-label">Choose a category</label>
        <div className="flex flex-wrap gap-1.5 mb-6" onMouseLeave={() => setHoveredCategory(null)}>
          {EVENT_CATEGORIES.map((key) => (
            <CategoryCard
              key={key}
              category={key}
              active={category === key}
              expanded={hoveredCategory === key}
              dimmed={hoveredCategory !== null && hoveredCategory !== key}
              onSelect={() => setCategory(key)}
              onHoverStart={() => setHoveredCategory(key)}
              size="md"
            />
          ))}
        </div>

        <label className="nm-label">Cover photo</label>
        <button
          type="button"
          className="w-full h-[110px] rounded-2xl border border-dashed border-gold/45 bg-ink2 flex flex-col items-center justify-center gap-1.5 text-gold-text mb-6"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <use href="#i-img" />
          </svg>
          <div className="text-[11.5px] font-bold">Add event photo</div>
        </button>

        <label className="nm-label">Event title</label>
        <input
          className="nm-field mb-4"
          placeholder="e.g. High Stakes Friday"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div>
            <label className="nm-label">Date</label>
            <input type="date" className="nm-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="nm-label">Start time</label>
            <input type="time" className="nm-field" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <label className="nm-label">Format / details</label>
        <input
          className="nm-field mb-4"
          placeholder="e.g. Texas Hold'em · No-limit"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div>
            <label className="nm-label">Seats / capacity</label>
            <div className="nm-field flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" stroke="#c9a8ff" fill="none">
                <use href="#i-seat" />
              </svg>
              <input
                type="number"
                min={1}
                className="bg-transparent outline-none w-full"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="nm-label">Price (optional)</label>
            <input
              className="nm-field"
              placeholder="Leave blank to hide"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <p className="text-[10.5px] text-muted2 font-semibold -mt-2.5 mb-4">
          Pricing stays hidden on your event unless you set it here — guests never see a number by default.
        </p>

        <label className="nm-label">Venue (shared after approval)</label>
        <input
          className="nm-field mb-4"
          placeholder="Area / locality, Bengaluru"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        <label className="nm-label">House rules &amp; notes</label>
        <textarea
          className="nm-field mb-1.5 resize-none"
          rows={3}
          placeholder="Chips only, no real-money wagering. BYO snacks…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="text-[10.5px] text-muted2 font-semibold mb-5">
          Real-money wagering stays disabled until legal &amp; app-store review is complete.
        </div>

        {/* Public / private visibility -- public events are discoverable
            by anyone within the chosen radius of your current location;
            private events only you (and whoever you approve) can see. */}
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className="nm-field w-full flex items-center justify-between bg-ink2 text-left mb-3"
        >
          <div>
            <div className="text-[12.5px] font-extrabold text-white">
              {isPublic ? 'Public event' : 'Private event'}
            </div>
            <div className="text-[10.5px] text-muted2 font-semibold mt-0.5">
              {isPublic
                ? 'Discoverable by anyone nearby, within your radius'
                : 'Only visible to you and people you invite'}
            </div>
          </div>
          <div
            className={`w-[42px] h-6 rounded-full relative shrink-0 transition-colors ${
              isPublic ? 'bg-gradient-to-b from-gold-light to-gold-dark' : 'bg-white/15'
            }`}
          >
            <div
              className="w-[18px] h-[18px] rounded-full bg-[#1a0f33] absolute top-[3px] transition-all"
              style={{ left: isPublic ? 21 : 3 }}
            />
          </div>
        </button>

        {isPublic && (
          <div className="nm-field bg-ink2 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12.5px] font-extrabold text-white">Discovery radius</div>
              <div className="text-[12.5px] font-extrabold text-gold-text">{radiusKm} km</div>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-[10.5px] text-muted2 font-semibold mt-1.5">
              People within {radiusKm} km of your location will see this event on Discover. Max 100 km.
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setRequireApproval((v) => !v)}
          className="nm-field w-full flex items-center justify-between bg-ink2 text-left"
        >
          <div>
            <div className="text-[12.5px] font-extrabold text-white">Require host approval</div>
            <div className="text-[10.5px] text-muted2 font-semibold mt-0.5">
              Review each request before it&apos;s confirmed
            </div>
          </div>
          <div
            className={`w-[42px] h-6 rounded-full relative shrink-0 transition-colors ${
              requireApproval ? 'bg-gradient-to-b from-gold-light to-gold-dark' : 'bg-white/15'
            }`}
          >
            <div
              className="w-[18px] h-[18px] rounded-full bg-[#1a0f33] absolute top-[3px] transition-all"
              style={{ left: requireApproval ? 21 : 3 }}
            />
          </div>
        </button>

        {error && (
          <div className="mt-4 rounded-xl bg-[#3a1030] border border-[#ff4f9e]/40 px-3.5 py-3 text-[12px] font-semibold text-[#ff9ecb]">
            {error}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent pt-6 pb-5 px-5">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handlePublish}
            disabled={submitting}
            className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-60"
          >
            {submitting ? 'Publishing…' : 'Publish event'}
          </button>
        </div>
      </div>
    </div>
  )
}
