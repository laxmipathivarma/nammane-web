'use client'

import { useEffect, useState } from 'react'

const avatars = [
  { img: '/assets/cards/x7.jpeg', pos: '50% 20%' },
  { img: '/assets/cards/u6.jpeg', pos: '50% 25%' },
  { img: '/assets/cards/x8.jpeg', pos: '50% 15%' },
  { img: '/assets/cards/x6.jpeg', pos: '50% 30%' },
]

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

  useEffect(() => {
    setToastOn(true)
  }, [])

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

        {/* Right: phone mock */}
        <div className="relative flex justify-center">
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

          {/* Toast */}
          {toastOn && (
            <div
              className="nm2-toast-pop nm2-glass absolute -left-4 bottom-10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
              style={{ maxWidth: 220 }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--nm-grad)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </span>
              <div className="text-white text-[12px] leading-snug font-semibold">
                Riya approved you<br />
                <span className="text-[var(--nm-text-meta)] font-normal">You&rsquo;re in for Poker Night.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
