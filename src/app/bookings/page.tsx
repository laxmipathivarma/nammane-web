'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'
import { useAuth } from '@/lib/AuthProvider'

type Tab = 'requested' | 'approved' | 'waitlist'

const bookings: Record<Tab, { slug: string; title: string; icon: string; iconBg: string; meta: string; note?: string; status: string; statusTone: 'pending' | 'confirmed' }[]> = {
  requested: [
    {
      slug: 'high-stakes-friday',
      title: 'High Stakes Friday',
      icon: 'i-spade',
      iconBg: 'radial-gradient(70% 90% at 30% 10%, #8b3ffb, #16092e)',
      meta: 'Fri, 8:30 PM · Indiranagar',
      note: 'Waiting on Rahul to approve — usually replies in 2h',
      status: 'PENDING',
      statusTone: 'pending',
    },
    {
      slug: 'rooftop-neon-soiree',
      title: 'Rooftop Neon Soirée',
      icon: 'i-party',
      iconBg: 'radial-gradient(70% 90% at 30% 10%, #ff4f9e, #2e0c20)',
      meta: 'Sat, 9 PM · Koramangala',
      status: 'PENDING',
      statusTone: 'pending',
    },
  ],
  approved: [
    {
      slug: 'sunday-13-card-social',
      title: 'Sunday 13-Card Social',
      icon: 'i-diamond',
      iconBg: 'radial-gradient(70% 90% at 70% 10%, #b968ff, #1e0d3a)',
      meta: 'HSR Layout · Sun, 5 PM',
      status: 'CONFIRMED',
      statusTone: 'confirmed',
    },
  ],
  waitlist: [],
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'requested', label: 'Requested' },
  { key: 'approved', label: 'Approved' },
  { key: 'waitlist', label: 'Waitlist' },
]

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('requested')
  const items = bookings[tab]
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login')
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="nm-bg min-h-screen text-white flex items-center justify-center">
        <div className="text-muted text-[13px] font-semibold">Loading your bookings…</div>
      </div>
    )
  }

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-16">
        <BackButton fallbackHref="/" className="mb-4" />
        <h1 className="nm-marquee text-2xl text-gold-text">My Bookings</h1>
        <p className="text-[12px] text-muted font-semibold mt-1">Track every table you&apos;re on</p>

        <div className="flex gap-1.5 bg-ink2 rounded-full p-1 mt-5 mb-5 max-w-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 text-center py-2.5 rounded-full text-[12px] font-extrabold transition-colors ${
                tab === t.key ? 'bg-gradient-to-b from-gold-light via-gold to-gold-dark text-white' : 'text-muted2'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="nm-card rounded-2xl p-6 text-center text-muted text-[13px] font-semibold">
            Nothing here yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((b) => (
              <Link key={b.slug} href={`/event/${b.slug}`} className="nm-card rounded-2xl p-3.5 flex gap-3 hover:border-gold/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: b.iconBg }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" className="opacity-85">
                    <use href={`#${b.icon}`} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-extrabold text-[13.5px]">{b.title}</div>
                    <div
                      className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                        b.statusTone === 'confirmed' ? 'bg-[#8fe3b0]/[0.18] text-[#8fe3b0]' : 'bg-gold/[0.09] text-gold-text'
                      }`}
                    >
                      {b.status}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted font-semibold mt-1.5 flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" stroke="#cfc9e6" fill="none">
                      <use href="#i-clock" />
                    </svg>
                    {b.meta}
                  </div>
                  {b.note && <div className="text-[10.5px] text-muted2 font-semibold mt-1">{b.note}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
