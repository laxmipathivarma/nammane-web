'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EVENT_CATEGORIES, type EventCategory } from '@/lib/eventCardStyle'
import { isEventCompleted } from '@/lib/eventStatus'
import { METRO_CITIES } from '@/lib/cities'
import CategoryCard from '@/components/CategoryCard'
import BackButton from '@/components/BackButton'
import { useAuth } from '@/lib/AuthProvider'

type EventRow = {
  id: string
  title: string
  category: EventCategory
  description: string | null
  starts_at: string | null
  city: string | null
  address: string | null
  capacity: number | null
  contribution_amount: number | null
  is_public: boolean
  radius_km: number | null
}

// A host can change anything about an event, anytime, right up until it
// starts -- after that it's "Event completed" and this page refuses to
// render a form at all (the PATCH endpoint also refuses server-side, so
// this is a courtesy, not the real gate). Mirrors /host/create's layout
// and fields closely on purpose: same inputs, same validation, so an edit
// feels like reopening the same form rather than a different experience.
export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'completed' | 'error'>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)

  const [category, setCategory] = useState<EventCategory>('poker')
  const [hoveredCategory, setHoveredCategory] = useState<EventCategory | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [radiusKm, setRadiusKm] = useState(25)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [format, setFormat] = useState('')
  const [capacity, setCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoadState('error')
      setLoadError('Sign in to edit this event.')
      return
    }
    fetch(`/api/events/${params.id}`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load this event.')
        const ev = j.event as EventRow
        if (j.completed || isEventCompleted(ev.starts_at)) {
          setLoadState('completed')
          return
        }
        setCategory(ev.category)
        setTitle(ev.title)
        setFormat(ev.description || '')
        setCapacity(ev.capacity ? String(ev.capacity) : '')
        setPrice(ev.contribution_amount ? String(ev.contribution_amount) : '')
        setCity(ev.city || '')
        setVenue(ev.address || '')
        setIsPublic(ev.is_public)
        setRadiusKm(ev.radius_km || 25)
        if (ev.starts_at) {
          const d = new Date(ev.starts_at)
          setDate(d.toLocaleDateString('en-CA')) // YYYY-MM-DD in local time
          setTime(d.toTimeString().slice(0, 5)) // HH:MM in local time
        }
        setLoadState('ready')
      })
      .catch((e) => {
        setLoadError(e.message)
        setLoadState('error')
      })
  }, [user, authLoading, params.id])

  const handleSave = async () => {
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
      const startsAt = date && time ? new Date(`${date}T${time}`).toISOString() : null

      const res = await fetch(`/api/events/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description: format || null,
          starts_at: startsAt,
          city: city || null,
          address: venue || null,
          capacity: capacity ? Number(capacity) : null,
          contribution_amount: price ? Number(price) : null,
          is_public: isPublic,
          radius_km: isPublic ? radiusKm : null,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Could not save your changes.')
        setSubmitting(false)
        return
      }

      router.push(`/event/${params.id}`)
    } catch (e) {
      console.error(e)
      setError('Something went wrong saving your changes.')
      setSubmitting(false)
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="nm-bg min-h-screen text-white flex items-center justify-center">
        <div className="text-[12.5px] text-muted2 font-semibold">Loading event…</div>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="nm-bg min-h-screen text-white flex flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="text-[13px] text-muted font-semibold">{loadError}</div>
        <a href="/host" className="nm-btn nm-btn-gold px-5 py-3 text-[13px]">
          Back to my events
        </a>
      </div>
    )
  }

  if (loadState === 'completed') {
    return (
      <div className="nm-bg min-h-screen text-white flex flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="text-[11px] font-extrabold px-3 py-1.5 rounded-full inline-block" style={{ background: 'rgba(255,255,255,.08)', color: '#a79ecb' }}>
          Event completed
        </div>
        <div className="text-[13px] text-muted font-semibold max-w-xs">
          This event has already happened, so it can&apos;t be edited anymore.
        </div>
        <a href={`/event/${params.id}`} className="nm-btn nm-btn-gold px-5 py-3 text-[13px]">
          View event
        </a>
      </div>
    )
  }

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-5 pt-7 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <BackButton
            variant="circle"
            fallbackHref={`/event/${params.id}`}
            label="Back"
            className="!w-8 !h-8 bg-ink2 border-0"
          />
          <h1 className="nm-marquee text-xl text-gold-text">Edit event</h1>
        </div>

        <label className="nm-label">Category</label>
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

        <label className="nm-label">City</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="nm-field mb-4">
          <option value="">Select city</option>
          {METRO_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="nm-label">Venue (shared after approval)</label>
        <input
          className="nm-field mb-5"
          placeholder="Area / locality, Bengaluru"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

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
            onClick={handleSave}
            disabled={submitting}
            className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
