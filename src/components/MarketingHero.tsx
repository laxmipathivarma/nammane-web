'use client'

import { useEffect, useState } from 'react'

const deck = [
  {
    icon: 'i-spade',
    label: '01/05',
    name: 'Poker',
    subtitle: "Texas Hold'em & more",
    bg: 'linear-gradient(160deg,#ffffff,#e9e3f7)',
    color: '#1b1030',
    iconBg: 'rgba(27,16,48,.08)',
    delay: '0s',
  },
  {
    icon: 'i-diamond',
    label: '02/05',
    name: 'Rummy',
    subtitle: '13-card classic nights',
    bg: 'linear-gradient(160deg,#c9a8ff,#8b3ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    delay: '-2s',
  },
  {
    icon: 'i-martini',
    label: '03/05',
    name: 'Drinks',
    subtitle: 'Rooftop pours & mixers',
    bg: 'linear-gradient(160deg,#8fe3ff,#1a8fd1)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    delay: '-4s',
  },
  {
    icon: 'i-dine',
    label: '04/05',
    name: 'Dinner',
    subtitle: 'Chef tables & feasts',
    bg: 'linear-gradient(160deg,#ffd37a,#e8942c)',
    color: '#3a2608',
    iconBg: 'rgba(58,38,8,.1)',
    delay: '-6s',
  },
  {
    icon: 'i-mic',
    label: '05/05',
    name: 'Karaoke',
    subtitle: 'Open mic & sing-alongs',
    bg: 'linear-gradient(160deg,#ff8fd1,#ff4f9e)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    delay: '-8s',
  },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function useScramble(text: string, delayMs: number) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text)
      return
    }
    let frame = 0
    const totalFrames = 10
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      interval = setInterval(() => {
        frame++
        const revealCount = Math.floor((frame / totalFrames) * text.length)
        const next = text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < revealCount) return text[i]
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
        setDisplay(next)
        if (frame >= totalFrames) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, 35)
    }, delayMs)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, delayMs])

  return display
}

export default function MarketingHero() {
  const line1 = useScramble('Find your kind', 250)
  const line2 = useScramble('of night out', 650)

  return (
    <section
      className="relative overflow-hidden px-5 pt-10 pb-16 md:pt-14 md:pb-20"
      style={{
        background:
          'radial-gradient(130% 90% at 18% -10%, #1c1240 0%, #0a081c 45%, #05050f 100%)',
      }}
    >
      <div
        className="absolute w-[640px] h-[640px] -left-44 -top-40 rounded-full opacity-55 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#8b3ffb,transparent 70%)' }}
      />
      <div
        className="absolute w-[560px] h-[560px] -right-32 top-16 rounded-full opacity-45 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#ff4f9e,transparent 70%)' }}
      />
      <div
        className="absolute w-[500px] h-[500px] right-40 -bottom-52 rounded-full opacity-35 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#4cc9f0,transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
            <span className="text-[#ff8fd1]">★</span> POKER · DINNER · DRINKS · KARAOKE
          </div>

          <h1 className="nm-head text-[2.6rem] leading-[1.08] md:text-[3.2rem] font-extrabold text-white m-0">
            {line1}{' '}
            <span
              style={{
                background: 'linear-gradient(120deg,#c57bff,#ff6fc2,#4cc9f0,#c57bff)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {line2.split(' ')[0]}
            </span>
            <br />
            {line2.split(' ').slice(1).join(' ')}
          </h1>

          <p className="text-muted text-[15px] font-medium leading-relaxed mt-5 max-w-md">
            Poker nights, dinner parties, rooftop drinks and karaoke sessions — hosted by real people, with approval before you show up. One app, 10+ ways to spend tonight.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mt-7">
            <a href="https://app.nammane.in/auth/signup" className="nm-btn nm-btn-gold px-7 py-4 text-[14.5px]">
              Find your night →
            </a>
            <button className="nm-btn nm-btn-ghost px-6 py-4 text-[14.5px] inline-flex items-center gap-2.5">
              <span className="w-[26px] h-[26px] rounded-full bg-white/15 flex items-center justify-center text-[10px]">▶</span>
              See it in action
            </button>
          </div>

          <div className="flex items-center gap-3.5 mt-9">
            <div className="flex items-center">
              {[{ i: 'RK', c: '#ff7fc2' }, { i: 'SM', c: '#5fd0ff' }, { i: 'AJ', c: '#b968ff' }].map((a, idx) => (
                <div
                  key={a.i}
                  className="w-[34px] h-[34px] rounded-full border-2 border-ink text-white text-[11px] font-extrabold flex items-center justify-center"
                  style={{ background: a.c, marginLeft: idx === 0 ? 0 : -10 }}
                >
                  {a.i}
                </div>
              ))}
            </div>
            <div className="text-[13px] text-[#e4e0f4] font-bold">4.9+ ★ rating from guests all over India</div>
          </div>
        </div>

        {/* shuffling card deck */}
        <div className="relative h-[460px] flex items-center justify-center">
          <div
            className="absolute w-[380px] h-[380px] rounded-full blur-sm pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(201,104,255,.5),transparent 70%)' }}
          />

          <div className="relative w-[244px] h-[330px]">
            {deck.map((card) => (
              <div
                key={card.name}
                className="nm-deck-card"
                style={{ background: card.bg, color: card.color, animationDelay: card.delay }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center" style={{ background: card.iconBg }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <use href={`#${card.icon}`} />
                    </svg>
                  </div>
                  <div className="text-[10.5px] font-extrabold tracking-[1.2px] opacity-55">{card.label}</div>
                </div>
                <div
                  className="self-center w-[118px] h-[118px] rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), rgba(255,255,255,.04) 65%)' }}
                >
                  <svg width="58" height="58" viewBox="0 0 24 24" fill="currentColor">
                    <use href={`#${card.icon}`} />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-[26px] h-[3px] rounded-sm" style={{ background: card.color, opacity: 0.6 }} />
                  <div className="nm-head text-[19px] font-extrabold tracking-wide">{card.name}</div>
                  <div className="text-[11px] font-bold opacity-75">{card.subtitle}</div>
                </div>
                <div className="nm-deck-sheen" />
              </div>
            ))}
          </div>

          {/* bobbing chip stack */}
          <svg
            width="150"
            height="130"
            viewBox="0 0 150 130"
            className="absolute left-1 bottom-2.5 overflow-visible pointer-events-none"
            style={{ filter: 'drop-shadow(0 18px 20px rgba(0,0,0,.45))', opacity: 0.9 }}
          >
            <use href="#nm-chip" className="nm-bob1" />
            <use href="#nm-chip" className="nm-bob2" />
            <use href="#nm-chip" className="nm-bob3" />
          </svg>

          {/* bobbing dice */}
          <div className="absolute right-3.5 bottom-3.5 w-28 h-[76px] pointer-events-none">
            <div className="nm-bob-dice absolute right-[38px] bottom-2 w-[62px] h-[62px]">
              <svg width="62" height="62" viewBox="0 0 78 78" style={{ filter: 'drop-shadow(0 16px 18px rgba(0,0,0,.4))' }}>
                <rect x="4" y="4" width="70" height="70" rx="16" fill="url(#g-dice)" />
                <rect x="4" y="4" width="70" height="70" rx="16" fill="none" stroke="#fff" strokeOpacity=".5" />
                <circle cx="24" cy="24" r="6" fill="#4a2e8a" />
                <circle cx="54" cy="24" r="6" fill="#4a2e8a" />
                <circle cx="24" cy="54" r="6" fill="#4a2e8a" />
                <circle cx="54" cy="54" r="6" fill="#4a2e8a" />
                <circle cx="39" cy="39" r="6" fill="#4a2e8a" />
              </svg>
            </div>
            <div className="nm-bob-dice2 absolute right-0 bottom-0 w-[46px] h-[46px]">
              <svg width="46" height="46" viewBox="0 0 78 78" style={{ filter: 'drop-shadow(0 12px 14px rgba(0,0,0,.4))' }}>
                <rect x="4" y="4" width="70" height="70" rx="16" fill="url(#g-dice2)" />
                <rect x="4" y="4" width="70" height="70" rx="16" fill="none" stroke="#fff" strokeOpacity=".6" />
                <circle cx="22" cy="22" r="7" fill="#9a5a08" />
                <circle cx="39" cy="39" r="7" fill="#9a5a08" />
                <circle cx="56" cy="56" r="7" fill="#9a5a08" />
              </svg>
            </div>
          </div>

          {/* pagination dots */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {deck.map((d) => (
              <span key={d.name} className="nm-dot" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
