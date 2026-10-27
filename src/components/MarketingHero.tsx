'use client'

import { useEffect, useState } from 'react'

const deck = [
  {
    icon: 'i-spade',
    name: 'Poker',
    subtitle: "Texas Hold'em & more",
    bg: 'linear-gradient(160deg,#ffffff,#e9e3f7)',
    color: '#1b1030',
    iconBg: 'rgba(27,16,48,.08)',
  },
  {
    icon: 'i-diamond',
    name: 'Rummy',
    subtitle: '13-card classic nights',
    bg: 'linear-gradient(160deg,#c9a8ff,#8b3ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
  },
  {
    icon: 'i-martini',
    name: 'Drinks',
    subtitle: 'Rooftop pours & mixers',
    bg: 'linear-gradient(160deg,#8fe3ff,#1a8fd1)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
  },
  {
    icon: 'i-dine',
    name: 'Dinner',
    subtitle: 'Grab a table & share a feast',
    bg: 'linear-gradient(160deg,#ffd37a,#e8942c)',
    color: '#3a2608',
    iconBg: 'rgba(58,38,8,.1)',
  },
  {
    icon: 'i-mic',
    name: 'Karaoke',
    subtitle: 'Open mic & sing-alongs',
    bg: 'linear-gradient(160deg,#ff8fd1,#ff4f9e)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
  },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function useScramble(text: string, delayMs: number) {
  const [display, setDisplay] = useState(text)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text)
      setDone(true)
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
          setDone(true)
        }
      }, 35)
    }, delayMs)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, delayMs])

  return { display, done }
}

export default function MarketingHero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % deck.length), 3200)
    return () => clearInterval(id)
  }, [])

  const line1 = useScramble('Find your kind', 250)
  const line2 = useScramble('of night out', 650)
  const card = deck[active]

  return (
    <section className="relative overflow-hidden px-5 pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="absolute w-[520px] h-[520px] -left-40 -top-20 rounded-full opacity-50 blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle,#8b3ffb,transparent 70%)' }} />
      <div className="absolute w-[460px] h-[460px] right-[-140px] top-[200px] rounded-full opacity-40 blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle,#ff4f9e,transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-center lg:text-left text-[12px] text-muted2 font-semibold mb-5 tracking-wide">
            Shuffling through every night out — Poker · Rummy · Drinks · Dinner · Karaoke
          </div>

          <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
            <span>★</span> POKER · DINNER · DRINKS · KARAOKE
          </div>

          <h1 className="nm-marquee text-[2.6rem] leading-[1.05] md:text-[3.4rem] text-white">
            {line1.display}{' '}
            <span
              style={{
                background: 'linear-gradient(120deg,#c57bff,#ff6fc2)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {line2.display.split(' ')[0]}
            </span>
            <br />
            {line2.display.split(' ').slice(1).join(' ')}
          </h1>

          <p className="text-muted text-[15px] font-medium leading-relaxed mt-5 max-w-md">
            Poker nights, dinner parties, rooftop drinks and karaoke sessions — hosted by real people, with approval before you show up. One app, 10+ ways to spend tonight.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-7">
            <a href="https://app.nammane.in/auth/signup" className="nm-btn nm-btn-gold px-6 py-3.5 text-[14.5px]">
              Find your night →
            </a>
            <button className="nm-btn nm-btn-ghost px-6 py-3.5 text-[14.5px] inline-flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[10px]">▶</span>
              See it in action
            </button>
          </div>

          <div className="flex items-center gap-3 mt-7">
            <div className="flex items-center">
              {[{ i: 'RK', c: '#ff6fc2' }, { i: 'SM', c: '#4cc9f0' }, { i: 'AJ', c: '#8b3ffb' }].map((a, idx) => (
                <div
                  key={a.i}
                  className="w-8 h-8 rounded-full border-2 border-ink text-white text-[10px] font-extrabold flex items-center justify-center"
                  style={{ background: a.c, marginLeft: idx === 0 ? 0 : -8 }}
                >
                  {a.i}
                </div>
              ))}
            </div>
            <div className="text-[13px] text-muted font-semibold">4.9+ ★ rating from guests all over India</div>
          </div>
        </div>

        {/* rotating card */}
        <div className="relative h-[420px] flex items-center justify-center">
          <div
            key={active}
            className="nm-hero-card-anim relative w-[260px] h-[340px] rounded-[28px] p-6 flex flex-col justify-between shadow-2xl"
            style={{ background: card.bg, color: card.color }}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <use href={`#${card.icon}`} />
                </svg>
              </div>
              <span className="text-[11px] font-bold opacity-70">{`0${active + 1}/0${deck.length}`}</span>
            </div>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(255,255,255,.22)' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <use href={`#${card.icon}`} />
              </svg>
            </div>
            <div>
              <div className="w-6 h-[3px] rounded-full mb-2" style={{ background: card.color, opacity: 0.5 }} />
              <div className="nm-marquee text-xl">{card.name}</div>
              <div className="text-[12.5px] font-medium opacity-75 mt-1">{card.subtitle}</div>
            </div>
          </div>

          {/* chip stack */}
          <div className="absolute left-2 bottom-10 w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 24 24">
              <use href="#i-chip-stack" />
            </svg>
          </div>
          {/* dice */}
          <div className="absolute right-0 bottom-16 flex gap-1">
            <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-[#6d1fd1] text-[10px] font-black shadow-lg rotate-[-8deg]">⚅</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-lg rotate-[10deg]" style={{ background: '#e8942c' }}>⚄</div>
          </div>

          {/* pagination dots */}
          <div className="absolute -bottom-2 flex gap-1.5">
            {deck.map((d, i) => (
              <span
                key={d.name}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === active ? '#ff6fc2' : 'rgba(255,255,255,.25)', width: i === active ? 16 : 6 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
