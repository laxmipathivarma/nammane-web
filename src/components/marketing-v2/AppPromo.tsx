'use client'

import { useEffect, useState } from 'react'

const avatars = [
  { img: '/assets/cards/x7.jpeg', pos: '50% 20%' },
  { img: '/assets/cards/u6.jpeg', pos: '50% 25%' },
  { img: '/assets/cards/x8.jpeg', pos: '50% 15%' },
  { img: '/assets/cards/x6.jpeg', pos: '50% 30%' },
]

type ToastIcon = 'check' | 'heart' | 'star' | 'bell' | 'person' | 'cards'

// 12 sample notifications cycling through the kinds of things actually
// happen on NamMane -- host approvals, guest requests, ratings, likes, new
// events and new games -- instead of one static "Riya approved you" toast.
const TOASTS: { icon: ToastIcon; title: string; subtitle: string }[] = [
  { icon: 'check', title: 'Riya approved you', subtitle: "You're in for Poker Night." },
  { icon: 'person', title: 'Varun requested to join', subtitle: 'Friday Drinks Night' },
  { icon: 'star', title: 'Priya rated you 5★', subtitle: 'Great host, smooth night!' },
  { icon: 'bell', title: 'New event near you', subtitle: 'Rooftop Karaoke · Indiranagar' },
  { icon: 'heart', title: 'Meera liked your event', subtitle: 'Sunday Rummy Social' },
  { icon: 'person', title: 'Karthik joined as guest', subtitle: 'Board Game Marathon' },
  { icon: 'bell', title: 'Aisha hosted a new night', subtitle: 'Neon Soirée · Koramangala' },
  { icon: 'check', title: 'You were approved!', subtitle: 'An Evening Table · Dinner' },
  { icon: 'person', title: '3 new requests to join', subtitle: 'High Stakes Friday' },
  { icon: 'star', title: 'Rahul rated the night 5★', subtitle: 'High Stakes Friday' },
  { icon: 'cards', title: 'New game added', subtitle: "Texas Hold'em · Thursday" },
  { icon: 'heart', title: 'Vikram liked your profile', subtitle: 'Verified host' },
]

function ToastIconGlyph({ icon }: { icon: ToastIcon }) {
  const common = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (icon) {
    case 'heart':
      return <svg {...common}><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.2 4.5 5.7 4a5 5 0 0 1 6.3 2.3A5 5 0 0 1 18.3 4c3.5.5 5.2 4 3.7 7.7C19.5 16.4 12 21 12 21Z" /></svg>
    case 'star':
      return <svg {...common}><path d="M12 2.5 15 9l7 1-5 5 1.3 7-6.3-3.3L5.7 22 7 15 2 10l7-1Z" /></svg>
    case 'bell':
      return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
    case 'person':
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" /></svg>
    case 'cards':
      return <svg {...common}><rect x="3" y="7" width="12" height="15" rx="2" transform="rotate(-8 9 14.5)" /><rect x="9" y="5" width="12" height="15" rx="2" /></svg>
    default:
      return <svg {...common}><path d="M5 12l5 5L19 7" /></svg>
  }
}

function MountainSilhouettes() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none overflow-hidden">
      <svg viewBox="0 0 1200 300" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="0,300 0,180 180,80 420,200 620,60 900,210 1080,120 1200,190 1200,300" fill="rgba(255,79,158,.14)" />
      </svg>
      <svg viewBox="0 0 1200 300" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="0,300 0,220 220,140 460,230 700,110 950,240 1200,160 1200,300" fill="#0A081C" />
      </svg>
    </div>
  )
}

export default function AppPromo() {
  const [toastOn, setToastOn] = useState(true)
  const [toastIndex, setToastIndex] = useState(0)

  useEffect(() => {
    setToastOn(true)
    // Cycle through the sample notifications so this reads as a live feed
    // rather than one frozen screenshot. The nm2-toast-pop CSS animation
    // (fade in -> hold -> fade out) runs a full 6s per mount, so advancing
    // on exactly that cadence lets each toast finish its own fade before
    // the next one pops in, instead of cutting it off mid-cycle.
    const id = setInterval(() => {
      setToastIndex((i) => (i + 1) % TOASTS.length)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  const toast = TOASTS[toastIndex]

  return (
    <section
      className="relative overflow-hidden py-24 px-5"
      style={{ background: 'linear-gradient(180deg,#06060F,#1C1240 70%,#3A1250)' }}
    >
      <MountainSilhouettes />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <h2 className="nm2-heading text-white font-black mb-6" style={{ fontSize: 'clamp(30px,4vw,46px)' }}>
            YOUR NEXT NIGHT OUT, <span className="nm2-grad-text">IN YOUR POCKET</span>
          </h2>

          <div className="flex items-center mb-5">
            {avatars.map((a, i) => (
              <div
                key={i}
                className="nm2-bob w-11 h-11 rounded-full p-[2px]"
                style={{
                  marginLeft: i === 0 ? 0 : -12,
                  background: 'linear-gradient(135deg,#8B3FFB,#FF4F9E,#4CC9F0)',
                  animationDelay: `${i * 0.4}s`,
                  zIndex: avatars.length - i,
                }}
              >
                <div
                  className="w-full h-full rounded-full border-2"
                  style={{ borderColor: '#0A081C', backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: a.pos }}
                />
              </div>
            ))}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[16px] font-bold -ml-3 border-2"
              style={{ background: 'var(--nm-grad)', borderColor: '#0A081C' }}
            >
              +
            </div>
          </div>

          <p className="text-[var(--nm-text-body)] text-[15px] mb-1.5">Host-approved guests, on every event.</p>
          <p className="text-[var(--nm-text-muted)] text-[13.5px] mb-7">Coming soon for Android &amp; iOS &mdash; use the web app today.</p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://app.nammane.in"
              className="nm2-grad-pill rounded-full px-6 py-3 text-[14px] font-bold text-white hover:-translate-y-0.5 transition-transform"
            >
              Open web app
            </a>
            <span className="border border-white/15 rounded-full px-4 py-2.5 text-[12px] font-bold text-[var(--nm-text-muted)] uppercase tracking-wide">
              App Store · Soon
            </span>
            <span className="border border-white/15 rounded-full px-4 py-2.5 text-[12px] font-bold text-[var(--nm-text-muted)] uppercase tracking-wide">
              Google Play · Soon
            </span>
          </div>
        </div>

        {/* Right: phone mock -- this wrapper is sized to exactly the
            phone's own footprint (270px) and centered with mx-auto,
            instead of being a full-width flex row. That keeps the toast
            (a sibling, not nested inside the rotated phone) anchored to
            where the phone actually sits on every screen size, including
            mobile, rather than drifting toward the section's edge. Siblings
            also means the toast doesn't inherit the phone's -3deg
            transform, so it stays level and doesn't appear to sink below
            the device like it did when it was a child of the rotated box. */}
        <div className="relative mx-auto" style={{ width: 270 }}>
          <div
            className="nm2-float-slow relative"
            style={{ width: 270, height: 550, borderRadius: 44, background: '#120f26', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 40px 80px rgba(0,0,0,.5)', transform: 'rotate(-3deg)' }}
          >
            <div className="absolute inset-[10px] rounded-[34px] overflow-hidden" style={{ background: '#0A081C' }}>
              <div className="relative h-[55%] nm2-image-grade">
                <img src="/assets/cards/poker.jpeg" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4" style={{ background: 'linear-gradient(0deg, rgba(5,5,15,.95), transparent)' }}>
                  <div className="nm2-heading text-white font-black text-[18px]">POKER NIGHT</div>
                  <div className="text-[var(--nm-text-meta)] text-[11.5px]">Texas hold&rsquo;em &middot; Bengaluru</div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <button className="nm2-grad-pill rounded-full py-2.5 text-[13px] font-bold text-white w-full">Request to join</button>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 rounded-xl overflow-hidden"><img src="/assets/cards/u5.jpeg" alt="" className="w-full h-full object-cover" /></div>
                  <div className="h-14 rounded-xl overflow-hidden"><img src="/assets/cards/u4.jpeg" alt="" className="w-full h-full object-cover" /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Toast -- sibling of the phone, positioned within this same
              270px box, so it sits over the phone's own bottom-left corner
              without inheriting its rotation. Keyed by toastIndex so the
              pop-in animation replays each time the sample notification
              cycles. */}
          {toastOn && (
            <div
              key={toastIndex}
              className="nm2-toast-pop nm2-glass absolute left-0 bottom-6 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
              style={{ maxWidth: 220 }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--nm-grad)' }}>
                <ToastIconGlyph icon={toast.icon} />
              </span>
              <div className="text-white text-[12px] leading-snug font-semibold">
                {toast.title}<br />
                <span className="text-[var(--nm-text-meta)] font-normal">{toast.subtitle}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
