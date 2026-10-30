'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthProvider'
import HostEventCard from '@/components/HostEventCard'
import type { EventCategory } from '@/lib/eventCardStyle'

type HostedEvent = {
  id: string
  title: string
  category: EventCategory
  starts_at: string | null
  is_public: boolean
  status: string
  created_at: string
}

// The dashboard every host lands on from the "Host" nav link. Before this
// existed, "Host" always went straight to the blank /host/create form --
// so a host who'd already published a poker event (and therefore already
// has Create Invitation / Invite Guests / Poker Tables / Settle Up / Games
// etc. waiting for them) had no way back to those tools except the
// one-time redirect right after publishing. This is that way back.
export default function HostDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [events, setEvents] = useState<HostedEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setError('Sign in to see your hosted events.')
      return
    }
    fetch('/api/events/mine')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load your events')
        setEvents(j.events as HostedEvent[])
      })
      .catch((e) => setError(e.message))
  }, [user, authLoading])

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date & time TBD'

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-5 pt-7 pb-28">
        <div className="flex items-center justify-between mb-6">
          <h1 className="nm-marquee text-xl text-gold-text">Host</h1>
          <Link href="/host/create" className="nm-btn nm-btn-gold px-4 py-2.5 text-[13px]">
            + New event
          </Link>
        </div>

        {error && (
          <div className="rounded-xl bg-[#3a1030] border border-[#ff4f9e]/40 px-3.5 py-3 text-[12px] font-semibold text-[#ff9ecb]">
            {error}
          </div>
        )}

        {!error && events === null && <div className="text-[12.5px] text-muted2 font-semibold">Loading your events…</div>}

        {!error && events !== null && events.length === 0 && (
          <div className="nm-field bg-ink2 flex flex-col items-center gap-3 py-10 text-center">
            <div className="text-[13px] text-muted font-semibold">You haven&apos;t hosted anything yet.</div>
            <Link href="/host/create" className="nm-btn nm-btn-gold px-5 py-3 text-[13px]">
              Create your first event
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
          {events?.map((ev) => (
            <HostEventCard
              key={ev.id}
              data={{ id: ev.id, title: ev.title, category: ev.category, when: fmt(ev.starts_at), isPublic: ev.is_public }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
