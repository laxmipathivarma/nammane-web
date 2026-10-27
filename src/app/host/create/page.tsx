'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/components/CategoryChips'

export default function CreateEventPage() {
  const [category, setCategory] = useState('poker')
  const [requireApproval, setRequireApproval] = useState(true)

  return (
    <div className="nm-bg min-h-screen text-[#f5efe3]">
      <div className="max-w-2xl mx-auto px-5 pt-7 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/discover" className="w-8 h-8 rounded-full bg-ink2 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" fill="none">
              <use href="#i-back" />
            </svg>
          </Link>
          <h1 className="nm-marquee text-xl text-gold-text">Host · New Event</h1>
        </div>

        <label className="nm-label">Choose a category</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={`rounded-2xl flex flex-col items-center gap-1.5 py-3 px-1.5 text-[10.5px] font-bold border transition-colors ${
                category === c.key
                  ? 'border-ruby bg-gradient-to-br from-[#3a2416] to-[#201a12] text-white shadow-[0_0_0_1px_rgba(178,58,74,.4),0_8px_16px_rgba(178,58,74,.13)]'
                  : 'border-white/10 bg-ink2 text-muted'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={category === c.key ? '#fff' : 'none'} stroke={category === c.key ? 'none' : '#b8ab98'}>
                <use href={`#${c.icon}`} />
              </svg>
              {c.label}
            </button>
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
        <input className="nm-field mb-4" placeholder="e.g. High Stakes Friday" />

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div>
            <label className="nm-label">Date</label>
            <input className="nm-field" placeholder="Fri, 31 Oct" />
          </div>
          <div>
            <label className="nm-label">Start time</label>
            <input className="nm-field" placeholder="8:30 PM" />
          </div>
        </div>

        <label className="nm-label">Format / details</label>
        <input className="nm-field mb-4" placeholder="e.g. Texas Hold'em · No-limit" />

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div>
            <label className="nm-label">Seats / capacity</label>
            <div className="nm-field flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
                <use href="#i-seat" />
              </svg>
              6
            </div>
          </div>
          <div>
            <label className="nm-label">Price (optional)</label>
            <input className="nm-field" placeholder="Leave blank to hide" />
          </div>
        </div>
        <p className="text-[10.5px] text-muted2 font-semibold -mt-2.5 mb-4">
          Pricing stays hidden on your event unless you set it here — guests never see a number by default.
        </p>

        <label className="nm-label">Venue (shared after approval)</label>
        <input className="nm-field mb-4" placeholder="Area / locality, Bengaluru" />

        <label className="nm-label">House rules &amp; notes</label>
        <textarea
          className="nm-field mb-1.5 resize-none"
          rows={3}
          placeholder="Chips only, no real-money wagering. BYO snacks…"
        />
        <div className="text-[10.5px] text-muted2 font-semibold mb-5">
          Real-money wagering stays disabled until legal &amp; app-store review is complete.
        </div>

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
              className="w-[18px] h-[18px] rounded-full bg-[#241607] absolute top-[3px] transition-all"
              style={{ left: requireApproval ? 21 : 3 }}
            />
          </div>
        </button>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent pt-6 pb-5 px-5">
        <div className="max-w-2xl mx-auto">
          <button type="button" className="nm-btn nm-btn-gold w-full py-4 text-[14.5px]">
            Publish event
          </button>
        </div>
      </div>
    </div>
  )
}
