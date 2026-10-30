'use client'

import { useState } from 'react'
import { cardStyle, type EventCategory } from '@/lib/eventCardStyle'

// The event page's share button was a dead <button> -- no onClick at
// all, so tapping it did nothing. This is the fix: a proper 3D NeoPOP
// share sheet (plinth shadow, the app's own violet/pink palette, the
// same tilt-card shine) instead of either a silent no-op or the plain
// native browser share sheet, which looks nothing like the rest of the
// app. Falls back to navigator.share (the real OS share sheet) only
// for "More options", for apps this sheet doesn't have its own button
// for.
export default function ShareEventModal({
  slug,
  title,
  category,
}: {
  slug: string
  title: string
  category: EventCategory
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const s = cardStyle[category]

  const url = `https://app.nammane.in/event/${slug}`
  const message = `You're invited: ${title}\n${url}`

  const openModal = () => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
    setOpen(true)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: `You're invited: ${title}`, url })
      setOpen(false)
    } catch {
      // user cancelled -- leave the sheet open
    }
  }

  return (
    <>
      <button onClick={openModal} className="nm-glass w-9 h-9 rounded-full flex items-center justify-center" aria-label="Share event">
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" fill="none">
          <use href="#i-share" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 px-4 pb-4 sm:pb-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="nm-share-sheet w-full max-w-sm rounded-[24px] overflow-hidden p-5"
            style={{
              background: s.bg,
              color: s.color,
              boxShadow: `${s.shadow}, 0 9px 0 0 ${s.plinth}, 0 9px 0 2px ${s.plinthDark}`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-extrabold tracking-wide opacity-70">SHARE THIS EVENT</div>
                <div className="nm-marquee text-[17px] font-extrabold mt-1">{title}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: s.iconBg }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 mt-5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="nm-btn w-full py-3 text-[13px] justify-start px-4 gap-3"
                style={{ background: '#1f8f5f', color: '#fff', boxShadow: '0 4px 0 0 #0f5c3a, 0 4px 0 2px #0a3d26' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><use href="#i-whatsapp" /></svg>
                Share on WhatsApp
              </a>

              <button
                type="button"
                onClick={copyLink}
                className="nm-btn w-full py-3 text-[13px] justify-start px-4 gap-3"
                style={{ background: s.ctaBg, color: s.ctaColor }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><use href="#i-link" /></svg>
                {copied ? 'Link copied!' : 'Copy link'}
              </button>

              {canNativeShare && (
                <button
                  type="button"
                  onClick={nativeShare}
                  className="nm-btn w-full py-3 text-[13px] justify-start px-4 gap-3 bg-transparent"
                  style={{ border: `1.5px solid ${s.plinth}`, color: s.color }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><use href="#i-share" /></svg>
                  More options…
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
