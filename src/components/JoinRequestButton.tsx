'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthProvider'

type BookingStatus = 'requested' | 'approved' | 'rejected' | 'waitlisted' | 'cancelled' | 'attended' | 'no-show'

// The "Request to join" button used to be a plain <button> with no
// onClick at all -- tapping it did nothing, which is exactly what a
// signed-in guest reported. This is the real thing: checks whether this
// viewer already has a booking on page load, sends the request to
// /api/events/[id]/bookings, and reflects whatever the host decides
// (Pending / You're in / Declined) instead of just flashing "sent" and
// forgetting about it.
export default function JoinRequestButton({ eventId }: { eventId: string }) {
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<BookingStatus | null | 'loading'>('loading')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setStatus(null)
      return
    }
    fetch(`/api/events/${eventId}/bookings`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not check your request')
        setStatus(j.role === 'guest' ? (j.booking?.status ?? null) : null)
      })
      .catch(() => setStatus(null))
  }, [eventId, user, authLoading])

  const request = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`/api/events/${eventId}/bookings`, { method: 'POST' })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Could not send your request')
      setStatus(j.booking?.status ?? 'requested')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your request')
    } finally {
      setSending(false)
    }
  }

  if (status === 'loading') {
    return (
      <button type="button" disabled className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] opacity-60">
        Checking…
      </button>
    )
  }

  if (status === 'approved' || status === 'attended') {
    return (
      <div className="nm-btn w-full py-4 text-[14.5px] text-center bg-[#15301f] text-[#8fe3b0] border border-[#8fe3b0]/30 flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <use href="#i-check" />
        </svg>
        You&apos;re in — approved
      </div>
    )
  }

  if (status === 'requested' || status === 'waitlisted') {
    return (
      <div className="nm-btn w-full py-4 text-[14.5px] text-center bg-ink2 text-[#c9a8ff] border border-[#8b3ffb]/30">
        Request sent — waiting on the host
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="nm-btn w-full py-4 text-[14.5px] text-center bg-ink2 text-muted2 border border-white/10">
        Request declined
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {error && <div className="text-[11.5px] font-semibold text-[#ff9ecb] text-center">{error}</div>}
      <button
        type="button"
        onClick={request}
        disabled={sending}
        className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-60"
      >
        {sending ? 'Sending…' : 'Request to join →'}
      </button>
    </div>
  )
}
