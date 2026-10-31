'use client'

import { useEffect, useMemo, useState } from 'react'
import CategoryChips, { CATEGORIES } from '@/components/CategoryChips'
import EventCard, { EventCardData } from '@/components/EventCard'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthProvider'
import { categoryLabel } from '@/lib/eventCardStyle'
import { METRO_CITIES } from '@/lib/cities'
import DelayedLoader from '@/components/ui/delayed-loader'

type EventRow = {
  id: string
  host_id: string
  title: string
  category: EventCardData['category']
  description: string | null
  is_public: boolean
  radius_km: number | null
  lat: number | null
  lng: number | null
  capacity: number | null
  contribution_amount: number | null
  address: string | null
  city: string | null
  starts_at: string | null
}

// What the Discover dropdown scopes the list to, independent of the
// category chips below it: category picks *what kind* of event, this
// picks *whose* events and which visibility.
type Scope = 'public' | 'mine' | 'private' | 'invited'
const SCOPES: { key: Scope; label: string }[] = [
  { key: 'public', label: 'Public Events' },
  { key: 'mine', label: 'Created By Me' },
  { key: 'private', label: 'Private Events' },
  { key: 'invited', label: 'My Invitations' },
]

// Haversine distance in km between two lat/lng points -- plain JS so we
// don't need PostGIS functions exposed through the REST API; events and
// the viewer's own location are both small payloads, so filtering
// client-side after a normal `select` is simple and fast enough.
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLng = ((bLng - aLng) * Math.PI) / 180
  const la1 = (aLat * Math.PI) / 180
  const la2 = (bLat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Every card, host's own events included, used to get the same generic
// "Request to join" CTA -- so a host looking at their own public event
// here (e.g. under "Created By Me") was told to request to join their
// own party. The event detail page itself has known this (isHost,
// since v1.7.2) for a while; this is the card carrying the same
// distinction instead of hard-coding one label for every public event.
function eventToCard(e: EventRow, distKm: number | null, viewerId: string | null): EventCardData {
  const seats = e.capacity ?? undefined
  const isHost = viewerId != null && e.host_id === viewerId
  return {
    slug: e.id,
    title: e.title,
    category: e.category,
    tagLabel: (categoryLabel[e.category] ?? 'Other').toUpperCase(),
    subtitle:
      [e.description, distKm != null ? `${distKm.toFixed(1)} km away` : null]
        .filter(Boolean)
        .join(' · ') || (e.is_public ? 'Public event' : 'Private event'),
    host: undefined,
    seatsLabel: seats ? `0/${seats} seats` : undefined,
    seatsFilledPct: seats ? 0 : undefined,
    ctaLabel: isHost ? 'Manage event' : e.is_public ? 'Request to join' : 'View event',
  }
}

export default function Discover() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<string>('poker')
  const [events, setEvents] = useState<EventRow[]>([])
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locDenied, setLocDenied] = useState(false)
  const [loading, setLoading] = useState(true)

  const [scope, setScope] = useState<Scope>('public')
  const [publicMode, setPublicMode] = useState<'city' | 'around'>('around')
  const [cityChoice, setCityChoice] = useState<string>('')
  const [viewerRadiusKm, setViewerRadiusKm] = useState(25)

  const [invited, setInvited] = useState<EventRow[] | null>(null)
  const [invitedLoading, setInvitedLoading] = useState(false)
  const [invitedNote, setInvitedNote] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocDenied(true),
      { timeout: 8000 }
    )
  }, [])

  useEffect(() => {
    const supabase = createClient()
    // RLS (database/002_public_private_radius.sql) already restricts this
    // to published public events, plus the signed-in user's own events --
    // no need to filter host-visibility client-side.
    supabase
      .from('events')
      .select('id,host_id,title,category,description,is_public,radius_km,lat,lng,capacity,contribution_amount,address,city,starts_at')
      .eq('status', 'published')
      .then(({ data, error }) => {
        if (error) console.error('discover fetch failed', error)
        setEvents((data as EventRow[]) || [])
        setLoading(false)
      })
  }, [])

  // "My Invitations" needs cross-host visibility (events someone else is
  // hosting, matched by the viewer's own phone number showing up in that
  // event's guest list) -- RLS rightly won't return those to a normal
  // client, so this is fetched from its own route only when that scope is
  // actually selected.
  useEffect(() => {
    if (scope !== 'invited' || invited !== null) return
    setInvitedLoading(true)
    fetch('/api/events/invited')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load your invitations')
        setInvited(j.events as EventRow[])
        if (j.reason === 'no_phone') setInvitedNote('Add a phone number to your profile so hosts’ invites can find you here.')
      })
      .catch(() => setInvitedNote('Could not load your invitations.'))
      .finally(() => setInvitedLoading(false))
  }, [scope, invited])

  // The "Select City" dropdown always offers the 8 major metros (so it's
  // never just "All cities" with nothing under it before any event has
  // been published there), plus any other city a host has actually set
  // on a public event that isn't already one of those 8.
  const cities = useMemo(() => {
    const fromEvents = events.filter((e) => e.is_public && e.city).map((e) => e.city as string)
    const extra = fromEvents.filter((c) => !(METRO_CITIES as readonly string[]).includes(c))
    return [...METRO_CITIES, ...Array.from(new Set(extra)).sort()]
  }, [events])

  const visible = useMemo(() => {
    const source = scope === 'invited' ? invited ?? [] : events
    const now = Date.now()
    return source
      .filter((e) => e.category === filter)
      // A night that's already happened has nothing to join -- hide it
      // from every guest-browsing scope. An event with no starts_at set
      // (date TBD) is left visible since there's no past date to judge it
      // against. "Created By Me" is left unfiltered on purpose: a host
      // managing their own events still needs to find past ones.
      .filter((e) => scope === 'mine' || !e.starts_at || new Date(e.starts_at).getTime() >= now)
      .filter((e) => {
        if (scope === 'invited') return true // already scoped server-side to "invites me"
        if (scope === 'mine') return !!user && e.host_id === user.id
        if (scope === 'private') return !!user && e.host_id === user.id && !e.is_public
        // scope === 'public'
        if (!e.is_public) return false
        if (publicMode === 'city') return !cityChoice || e.city === cityChoice
        // publicMode === 'around' -- viewer picks the radius, independent
        // of whatever discovery radius the host themselves set.
        if (e.lat == null || e.lng == null) return true // nothing to distance-filter against -- don't hide it
        if (!coords) return true // haven't got the viewer's location yet/denied -- don't hide events, just skip distance info
        return distanceKm(coords.lat, coords.lng, e.lat, e.lng) <= viewerRadiusKm
      })
  }, [events, invited, scope, filter, coords, user, publicMode, cityChoice, viewerRadiusKm])

  const activeLabel = CATEGORIES.find((c) => c.key === filter)?.label ?? ''

  return (
    <div className="nm-root nm-bg min-h-screen text-white">
      <div className="px-5 pt-8 pb-4 max-w-5xl mx-auto">
        <h1 className="nm-marquee text-2xl md:text-3xl text-gold-text font-extrabold">Discover</h1>
        <p className="text-[12.5px] text-muted font-semibold mt-1">
          {locDenied
            ? "Tonight's hottest tables, your rules"
            : coords
              ? 'Showing public events near your location'
              : 'Finding events near you…'}
        </p>
      </div>

      <div className="px-5 pb-4 max-w-5xl mx-auto">
        <label className="nm-label">Show</label>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as Scope)}
          className="nm-field w-full sm:w-64"
        >
          {SCOPES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        {scope === 'public' && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex gap-1.5 bg-ink2 rounded-full p-1 w-fit">
              {(['around', 'city'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPublicMode(m)}
                  className={`px-3.5 py-2 rounded-full text-[11.5px] font-extrabold transition-colors ${
                    publicMode === m ? 'bg-gradient-to-b from-gold-light via-gold to-gold-dark text-white' : 'text-muted2'
                  }`}
                >
                  {m === 'around' ? 'Around me' : 'Select city'}
                </button>
              ))}
            </div>

            {publicMode === 'around' ? (
              <div className="nm-field bg-ink2 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12.5px] font-extrabold text-white">Radius</div>
                  <div className="text-[12.5px] font-extrabold text-gold-text">{viewerRadiusKm} km</div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={viewerRadiusKm}
                  onChange={(e) => setViewerRadiusKm(Number(e.target.value))}
                  className="w-full"
                />
                {locDenied && (
                  <div className="text-[10.5px] text-muted2 font-semibold mt-1.5">
                    Location access is off, so distance can&apos;t be checked -- every public event still shows.
                  </div>
                )}
              </div>
            ) : (
              <select value={cityChoice} onChange={(e) => setCityChoice(e.target.value)} className="nm-field max-w-sm">
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {scope === 'invited' && invitedNote && (
          <div className="mt-3 text-[11.5px] text-muted2 font-semibold">{invitedNote}</div>
        )}
      </div>

      <div className="px-5 pb-6 max-w-5xl mx-auto">
        <CategoryChips onChange={setFilter} />
      </div>

      <div className="px-5 pb-20 max-w-5xl mx-auto">
        <div className="text-[13px] text-muted font-bold mb-4">
          {loading || (scope === 'invited' && invitedLoading)
            ? 'Loading events…'
            : `${visible.length} ${activeLabel} ${visible.length === 1 ? 'event' : 'events'}`}
        </div>
        {/* Instant loads (the common case) show just the text above and
            nothing else. Only a fetch that's still running past ~1s gets
            the branded loader -- see DelayedLoader's own comment. */}
        {(loading || (scope === 'invited' && invitedLoading)) && <DelayedLoader />}
        {!loading && !(scope === 'invited' && invitedLoading) && visible.length === 0 && (
          <div className="text-[12.5px] text-muted2 font-semibold">
            {scope === 'mine' && `You haven't created any ${activeLabel.toLowerCase()} events yet.`}
            {scope === 'private' && `No private ${activeLabel.toLowerCase()} events of yours yet.`}
            {scope === 'invited' && !invitedNote && `No ${activeLabel.toLowerCase()} invitations yet.`}
            {scope === 'public' && `No ${activeLabel.toLowerCase()} events published here yet — be the first to host one.`}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((e) => (
            <EventCard
              key={e.id}
              data={eventToCard(
                e,
                coords && e.lat != null && e.lng != null
                  ? distanceKm(coords.lat, coords.lng, e.lat, e.lng)
                  : null,
                user?.id ?? null
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
