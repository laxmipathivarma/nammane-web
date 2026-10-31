'use client'

import { useState } from 'react'

export type HostDetails = {
  name: string
  avatarUrl: string | null
  bio: string | null
  city: string | null
  ratingAvg: number | null
  ratingCount: number
  reviews: {
    rating: number | null
    comment: string | null
    createdAt: string
    reviewerName: string
  }[]
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={n <= Math.round(value) ? '#ffcf5c' : 'none'}
          stroke="#ffcf5c"
          strokeWidth="1.5"
        >
          <path d="M12 2.5l2.9 6.4 7 .7-5.3 4.7 1.6 6.9L12 17.6 5.8 21.2l1.6-6.9-5.3-4.7 7-.7z" />
        </svg>
      ))}
    </div>
  )
}

// "Who is this person, really?" is the one question a guest can't answer
// from the event card alone -- before this, "Hosted by the host" was
// literally that: a hardcoded placeholder, not the real host's name or
// anything about them. Tapping it now opens this sheet with their public
// profile (name, city, bio) plus the one thing that actually signals
// trust -- their rating and what past guests said -- so a guest has
// something real to go on before tapping "Request to join".
export default function HostDetailsModal({
  host,
  eventsHosted,
}: {
  host: HostDetails
  eventsHosted: number
}) {
  const [open, setOpen] = useState(false)
  const initials = host.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 py-3 border-b border-white/[0.08] w-full text-left"
      >
        <div className="w-9 h-9 rounded-[11px] bg-white/[0.07] flex items-center justify-center shrink-0">
          <svg width="17" height="17" viewBox="0 0 24 24" stroke="#ff8fd1" fill="none">
            <use href="#i-shield" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold">Hosted by {host.name}</div>
          <div className="text-[11.5px] text-[#a79ecb] font-semibold flex items-center gap-1.5">
            <span>Verified host · {eventsHosted} events hosted</span>
            {host.ratingCount > 0 && (
              <>
                <span>·</span>
                <span className="text-[#ffcf5c]">★ {host.ratingAvg!.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-[11px] font-bold text-[#c9a8ff] shrink-0">View profile</div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 px-4 pb-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="nm-glass w-full max-w-sm rounded-[24px] overflow-hidden p-5 max-h-[80vh] overflow-y-auto"
            style={{ background: '#1a1030' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-[11px] font-extrabold tracking-wide text-[#a79ecb]">HOST PROFILE</div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/[0.08]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {host.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={host.avatarUrl} alt={host.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-extrabold text-white" style={{ background: 'linear-gradient(135deg,#8b3ffb,#ff4f9e)' }}>
                  {initials || 'H'}
                </div>
              )}
              <div>
                <div className="text-[15px] font-extrabold text-white">{host.name}</div>
                {host.city && <div className="text-[12px] text-[#a79ecb] font-semibold">{host.city}</div>}
              </div>
            </div>

            {host.bio && <p className="text-[12.5px] text-muted font-medium leading-relaxed mt-3.5">{host.bio}</p>}

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.08]">
              <div>
                <div className="text-[15px] font-extrabold text-white">{eventsHosted}</div>
                <div className="text-[10.5px] text-[#a79ecb] font-semibold">Events hosted</div>
              </div>
              <div>
                <div className="text-[15px] font-extrabold text-white flex items-center gap-1">
                  {host.ratingCount > 0 ? host.ratingAvg!.toFixed(1) : '—'}
                  {host.ratingCount > 0 && <Stars value={host.ratingAvg!} />}
                </div>
                <div className="text-[10.5px] text-[#a79ecb] font-semibold">
                  {host.ratingCount > 0 ? `${host.ratingCount} rating${host.ratingCount === 1 ? '' : 's'}` : 'No ratings yet'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-extrabold tracking-wide text-muted mb-2.5">WHAT GUESTS SAY</div>
              {host.reviews.length === 0 ? (
                <div className="text-[12px] text-[#a79ecb] font-semibold">No reviews yet -- be the first to go and tell everyone how it went.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {host.reviews.map((r, i) => (
                    <div key={i} className="bg-white/[0.05] rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[12px] font-bold text-white">{r.reviewerName}</div>
                        {typeof r.rating === 'number' && <Stars value={r.rating} />}
                      </div>
                      {r.comment && <p className="text-[12px] text-muted font-medium mt-1 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
