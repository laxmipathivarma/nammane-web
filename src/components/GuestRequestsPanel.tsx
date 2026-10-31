'use client'

import { useEffect, useState } from 'react'

type Booking = {
  id: string
  guest_id: string
  status: string
  guest_count: number | null
  requested_at: string
  decided_at: string | null
  profiles: { display_name: string | null; avatar_url: string | null } | null
}

// The host side of "Request to join" -- every event that takes bookings
// (not just poker, which already has its own phone-invite-based Guest
// Approvals under Host Tools) needs somewhere to see who's asked to come
// and approve or reject them. Shown on the event detail page only for
// event.isHost.
export default function GuestRequestsPanel({ eventId }: { eventId: string }) {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    fetch(`/api/events/${eventId}/bookings`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load guest requests')
        setBookings(j.role === 'host' ? (j.bookings as Booking[]) : [])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load guest requests'))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const decide = async (bookingId: string, status: 'approved' | 'rejected') => {
    setBusyId(bookingId)
    try {
      const res = await fetch(`/api/events/${eventId}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Could not update that request')
      setBookings((prev) => prev && prev.map((b) => (b.id === bookingId ? { ...b, status } : b)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update that request')
    } finally {
      setBusyId(null)
    }
  }

  if (error) {
    return <div className="mt-5 text-[12px] font-semibold text-[#ff9ecb]">{error}</div>
  }
  if (bookings === null) {
    return <div className="mt-5 text-[12px] text-muted2 font-semibold">Loading guest requests…</div>
  }

  const pending = bookings.filter((b) => b.status === 'requested' || b.status === 'waitlisted')
  const decided = bookings.filter((b) => b.status === 'approved' || b.status === 'rejected')

  if (bookings.length === 0) {
    return (
      <div className="mt-5">
        <div className="text-[12px] font-extrabold text-muted mb-2 tracking-wide">GUEST REQUESTS</div>
        <div className="nm-glass rounded-[18px] p-4 text-[12.5px] text-muted2 font-semibold text-center">
          No one has requested to join yet.
        </div>
      </div>
    )
  }

  const nameFor = (b: Booking) => b.profiles?.display_name || 'A guest'
  const initialFor = (b: Booking) => nameFor(b).charAt(0).toUpperCase()

  return (
    <div className="mt-5">
      <div className="text-[12px] font-extrabold text-muted mb-2 tracking-wide">
        GUEST REQUESTS{pending.length > 0 ? ` (${pending.length} waiting)` : ''}
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-2 mb-2">
          {pending.map((b) => (
            <div key={b.id} className="nm-glass rounded-[18px] p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8b3ffb]/20 text-[#c9a8ff] text-[12px] font-extrabold flex items-center justify-center shrink-0">
                {initialFor(b)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold truncate">{nameFor(b)}</div>
                <div className="text-[10.5px] text-muted2 font-semibold">
                  Requested {new Date(b.requested_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <button
                type="button"
                disabled={busyId === b.id}
                onClick={() => decide(b.id, 'rejected')}
                className="nm-btn px-3 py-2 text-[11.5px] bg-ink2 text-muted2 border border-white/10 disabled:opacity-60"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={busyId === b.id}
                onClick={() => decide(b.id, 'approved')}
                className="nm-btn nm-btn-gold px-3 py-2 text-[11.5px] disabled:opacity-60"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {decided.map((b) => (
            <div key={b.id} className="flex items-center gap-2.5 px-1 py-1.5">
              <div className="w-6 h-6 rounded-full bg-white/[0.07] text-muted2 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                {initialFor(b)}
              </div>
              <div className="text-[11.5px] font-semibold text-muted2 flex-1 truncate">{nameFor(b)}</div>
              <div
                className="text-[10.5px] font-extrabold px-2 py-1 rounded-full"
                style={
                  b.status === 'approved'
                    ? { background: 'rgba(143,227,176,.12)', color: '#8fe3b0' }
                    : { background: 'rgba(255,255,255,.06)', color: '#8a84a3' }
                }
              >
                {b.status === 'approved' ? 'Approved' : 'Rejected'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
