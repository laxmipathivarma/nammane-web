'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [mode, setMode] = useState<'guest' | 'host'>('host')

  return (
    <div className="nm-bg min-h-screen text-[#f5efe3]">
      <div className="relative px-5 pt-10 pb-14 overflow-hidden text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'conic-gradient(from 180deg at 50% 0%, rgba(178,58,74,.13), rgba(205,168,88,.09), transparent 50%)' }}
        />
        <div className="nm-marquee relative z-10 text-[15px] text-gold-text">My Profile</div>
      </div>

      <div className="max-w-md mx-auto px-5 -mt-14 flex flex-col items-center relative z-10">
        <div className="w-21 h-21 rounded-full border-[3px] border-ink flex items-center justify-center text-2xl font-extrabold text-white shadow-xl" style={{ width: 84, height: 84, background: 'linear-gradient(160deg,#c9707a,#6a4a2a)' }}>
          LV
        </div>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="text-[17px] font-extrabold">Laxmipathi Varma</div>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <use href="#i-check" />
          </svg>
        </div>
        <div className="text-[11.5px] text-muted font-semibold mt-0.5">Bengaluru · member since 2026</div>

        <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px] mt-3.5">
          <button
            onClick={() => setMode('guest')}
            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold ${mode === 'guest' ? 'nm-btn-gold' : 'text-muted'}`}
          >
            Guest
          </button>
          <button
            onClick={() => setMode('host')}
            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold ${mode === 'host' ? 'nm-btn-gold' : 'text-muted'}`}
          >
            Host
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6 grid grid-cols-3 gap-2.5">
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text">12</div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">Events hosted</div>
        </div>
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text flex items-center justify-center gap-1">
            4.9
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <use href="#i-star" />
            </svg>
          </div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">Host rating</div>
        </div>
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text">68%</div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">Repeat guests</div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="text-[12px] font-extrabold text-[#e8ddc8] mb-2">Trust &amp; verification</div>
        <div className="nm-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.06]">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#8fe3b0" fill="none">
              <use href="#i-shield" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Government ID verified</div>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <use href="#i-check" />
            </svg>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.06]">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#d9bd7a" fill="none">
              <use href="#i-lock" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Phone &amp; email verified</div>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <use href="#i-check" />
            </svg>
          </div>
          <button className="w-full flex items-center gap-3 px-3.5 py-3 text-left">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#c97a82" fill="none">
              <use href="#i-flag" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Report or block a user</div>
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="#b8ab98" fill="none">
              <use href="#i-chev-r" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="text-[12px] font-extrabold text-[#e8ddc8] mb-2">Recent review</div>
        <div className="nm-card rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-full bg-[#16804f] text-white text-[10px] font-extrabold flex items-center justify-center" style={{ width: 26, height: 26 }}>
              AJ
            </div>
            <div className="text-[12px] font-bold">Aisha J.</div>
            <div className="flex gap-0.5 ml-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#d9bd7a">
                  <use href="#i-star" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-[#d9cdb8] font-semibold mt-2 leading-relaxed">
            &quot;Best-run poker night I&apos;ve been to in Bengaluru — clear rules, great crowd, felt completely safe.&quot;
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6 pb-16">
        <button className="w-full flex items-center justify-between text-muted">
          <div className="flex items-center gap-2.5 text-[13px] font-bold">
            <svg width="17" height="17" viewBox="0 0 24 24" stroke="#b8ab98" fill="none">
              <use href="#i-cog" />
            </svg>
            Privacy &amp; account settings
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="#b8ab98" fill="none">
            <use href="#i-chev-r" />
          </svg>
        </button>
      </div>
    </div>
  )
}
