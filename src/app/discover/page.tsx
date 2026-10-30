'use client'

import { useEffect, useMemo, useState } from 'react'
import CategoryChips, { CATEGORIES } from '@/components/CategoryChips'
import EventCard, { EventCardData } from '@/components/EventCard'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthProvider'

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
  starts_at: string | null
}

const tagLabel: Record<EventCardData['category'], string> = {
  poker: 'POKER',
  rummy: 'RUMMY',
  drinks: 'DRINKS',
  dinner: 'DINNER',
  party: 'PARTY',
  other: 'OTHER',
}

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

function eventToCard(e: EventRow, distKm: number | null): EventCardData {
  const seats = e.capacity ?? undefined
  return {
    slug: e.id,
    title: e.title,
    category: e.category,
    tagLabel: tagLabel[e.category] ?? 'OTHER',
    subtitle:
      [e.description, distKm != null ? `${distKm.toFixed(1)} km away` : null]
        .filter(Boolean)
        .join(' · ') || (e.is_public ? 'Public event' : 'Private event'),
    host: undefined,
    seatsLabel: seats ? `0/${seats} seats` : undefined,
    seatsFilledPct: seats ? 0 : undefined,
    ctaLabel: e.is_public ? 'Request to join' : 'View event',
  }
}

export default function Discover() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<string>('poker')
  const [events, setEvents] = useState<EventRow[]>([])
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locDenied, setLocDenied] = useState(false)
  const [loading, setLoading] = useState(true)

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
      .select('id,host_id,title,category,description,is_public,radius_km,lat,lng,capacity,contribution_amount,address,starts_at')
      .eq('status', 'published')
      .then(({ data, error }) => {
        if (error) console.error('discover fetch failed', error)
        setEvents((data as EventRow[]) || [])
        setLoading(false)
      })
  }, [])

  const visible = useMemo(() => {
    return events
      .filter((e) => e.category === filter)
      .filter((e) => {
        // Always show your own events (public or private).
        if (user && e.host_id === user.id) return true
        if (!e.is_public) return false
        // A public event with no stored location/radius is shown to
        // everyone rather than silently hidden (can't distance-filter
        // what has no coordinates).
        if (e.lat == null || e.lng == null || !e.radius_km) return true
        if (!coords) return true // haven't got the viewer's location yet/denied -- don't hide events, just skip distance info
        return distanceKm(coords.lat, coords.lng, e.lat, e.lng) <= e.radius_km
      })
  }, [events, filter, coords, user])

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

      <div className="px-5 pb-6 max-w-5xl mx-auto">
        <CategoryChips onChange={setFilter} />
      </div>

      <div className="px-5 pb-20 max-w-5xl mx-auto">
        <div className="text-[13px] text-muted font-bold mb-4">
          {loading
            ? 'Loading events…'
            : `${visible.length} ${activeLabel} ${visible.length === 1 ? 'event' : 'events'} near you`}
        </div>
        {!loading && visible.length === 0 && (
          <div className="text-[12.5px] text-muted2 font-semibold">
            No {activeLabel.toLowerCase()} events published nearby yet — be the first to host one.
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
                  : null
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
