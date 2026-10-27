'use client'

import { useEffect, useState } from 'react'

type FanCardData = {
  key: string
  rot: number
  x: number
  z: number
  scale: number
  bg: string
  border: string
  rank: string
  suit: string
  icon: string
  title: string
  sub: string
  dark?: boolean
}

const cards: FanCardData[] = [
  {
    key: 'cheers',
    rot: -16,
    x: -222,
    z: 10,
    scale: 0.88,
    bg: 'linear-gradient(160deg,#5a9bff,#1c57d6)',
    border: 'rgba(255,255,255,.35)',
    rank: 'K',
    suit: 'i-diamond',
    icon: 'i-martini',
    title: 'Cheers',
    sub: 'ROOFTOP POURS',
  },
  {
    key: 'feast',
    rot: -8,
    x: -112,
    z: 20,
    scale: 0.94,
    bg: 'linear-gradient(160deg,#ff78bd,#e22f82)',
    border: 'rgba(255,255,255,.35)',
    rank: 'Q',
    suit: 'i-heart',
    icon: 'i-dine',
    title: 'Feast',
    sub: 'CHEF TABLES',
  },
  {
    key: 'poker',
    rot: 0,
    x: 0,
    z: 40,
    scale: 1.08,
    bg: 'linear-gradient(160deg,#171229,#0b0918)',
    border: '#e3b64c',
    rank: 'A',
    suit: 'i-spade',
    icon: 'i-spade',
    title: 'Poker',
    sub: "TEXAS HOLD'EM",
    dark: true,
  },
  {
    key: 'dance',
    rot: 8,
    x: 112,
    z: 20,
    scale: 0.94,
    bg: 'linear-gradient(160deg,#3fe0a0,#149a66)',
    border: 'rgba(255,255,255,.35)',
    rank: 'J',
    suit: 'i-club',
    icon: 'i-disco',
    title: 'Dance',
    sub: 'MOVE TOGETHER',
  },
  {
    key: 'karaoke',
    rot: 16,
    x: 222,
    z: 10,
    scale: 0.88,
    bg: 'linear-gradient(160deg,#b17bff,#7a2ee0)',
    border: 'rgba(255,255,255,.35)',
    rank: '10',
    suit: 'i-heart',
    icon: 'i-mic',
    title: 'Karaoke',
    sub: 'OPEN MIC',
  },
]

const scatter = [
  { id: 'c1', icon: 'i-spade', left: '7%', top: '38%', size: 26, color: '#3a2e63', delay: '0s' },
  { id: 'c2', icon: 'i-club', left: '13%', top: '68%', size: 20, color: '#2d2550', delay: '1.1s' },
  { id: 'c3', icon: 'i-diamond', left: '90%', top: '30%', size: 24, color: '#ff6fb5', delay: '.6s' },
  { id: 'c4', icon: 'i-heart', left: '9%', top: '16%', size: 22, color: '#ff6fb5', delay: '1.7s' },
  { id: 'c5', icon: 'i-club', left: '92%', top: '62%', size: 22, color: '#2d2550', delay: '.3s' },
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

function AvatarBadge({ name, initials, color, delay }: { name: string; initials: string; color: string; delay?: string }) {
  return (
    <div className="nm-glass nm-float-slow inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full" style={{ animationDelay: delay }}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10.5px] font-extrabold"
        style={{ background: color }}
      >
        {initials}
      </div>
      <span className="text-[12.5px] font-bold text-white">{name}</span>
    </div>
  )
}

function FanCard({ c, idx }: { c: FanCardData; idx: number }) {
  const width = c.dark ? 222 : 192
  const height = c.dark ? 332 : 286
  const fontSize = c.dark ? 23 : 18
  const titleSize = c.dark ? 27 : 20

  return (
    <div
      className="absolute left-1/2 bottom-0"
      style={{ transform: `translateX(calc(-50% + ${c.x}px))`, zIndex: c.z }}
    >
      <div
        className="nm-fan-card rounded-[20px] relative overflow-hidden"
        style={
          {
            width,
            height,
            background: c.bg,
            border: `2px solid ${c.border}`,
            boxShadow: '0 26px 42px -14px rgba(0,0,0,.6)',
            '--rot': `${c.rot}deg`,
            '--scale': c.scale,
            animationDelay: `${idx * 0.18}s`,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute top-3.5 left-3.5 font-black leading-none text-center"
          style={{ color: c.dark ? '#e3b64c' : '#fff', fontSize }}
        >
          <div>{c.rank}</div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 mx-auto">
            <use href={`#${c.suit}`} />
          </svg>
        </div>
        <div
          className="absolute bottom-3.5 right-3.5 font-black leading-none rotate-180 text-center"
          style={{ color: c.dark ? '#e3b64c' : '#fff', fontSize }}
        >
          <div>{c.rank}</div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 mx-auto">
            <use href={`#${c.suit}`} />
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={c.dark ? 104 : 62}
            height={c.dark ? 104 : 62}
            viewBox="0 0 24 24"
            fill={c.dark ? 'url(#g-gold-fill)' : 'rgba(255,255,255,.92)'}
          >
            <use href={`#${c.icon}`} />
          </svg>
        </div>

        <div className="absolute left-0 right-0 bottom-7 text-center px-2">
          <div className="nm-head font-extrabold" style={{ color: c.dark ? '#e3b64c' : '#fff', fontSize: titleSize }}>
            {c.title}
          </div>
          <div
            className="text-[10px] font-bold tracking-[1.6px] mt-1"
            style={{ color: c.dark ? 'rgba(227,182,76,.75)' : 'rgba(255,255,255,.78)' }}
          >
            {c.sub}
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(120deg, rgba(255,255,255,.16), transparent 42%)' }}
        />
      </div>
    </div>
  )
}

export default function MarketingHero() {
  const line1 = useScramble('Find your kind', 250)
  const line2 = useScramble('of night out', 650)

  return (
    <section
      className="relative overflow-hidden px-5 pt-14 pb-6 md:pt-16"
      style={{
        background: 'radial-gradient(130% 70% at 50% -15%, #241a4d 0%, #0a081c 50%, #05050f 100%)',
      }}
    >
      <div
        className="absolute w-[560px] h-[560px] left-1/2 -translate-x-1/2 -top-64 rounded-full opacity-40 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#8b3ffb,transparent 70%)' }}
      />
      <div
        className="absolute w-[460px] h-[460px] -right-28 top-10 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#ff4f9e,transparent 70%)' }}
      />
      <div
        className="absolute w-[460px] h-[460px] -left-28 top-16 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#4cc9f0,transparent 70%)' }}
      />

      <div className="absolute inset-0 pointer-events-none select-none hidden md:block">
        {scatter.map((s) => (
          <svg
            key={s.id}
            className="absolute nm-float"
            style={{ left: s.left, top: s.top, animationDelay: s.delay, opacity: 0.5 }}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill={s.color}
          >
            <use href={`#${s.icon}`} />
          </svg>
        ))}
      </div>

      <div className="hidden lg:block absolute left-[7%] top-[168px] z-30">
        <AvatarBadge name="Riya" initials="RK" color="#ff6fb0" />
      </div>
      <div className="hidden lg:block absolute right-[7%] top-[168px] z-30">
        <AvatarBadge name="Arjun" initials="AJ" color="#5fc6ff" delay="1.2s" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="nm-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
          <span>🏆</span> POKER · DINNER · DRINKS · DANCE · KARAOKE
        </div>

        <h1 className="nm-head text-[2.5rem] leading-[1.1] md:text-[3.1rem] font-extrabold text-white m-0">
          {line1.split(' ').slice(0, 2).join(' ')}{' '}
          <span
            style={{
              background: 'linear-gradient(120deg,#c57bff,#ff6fc2,#4cc9f0,#c57bff)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {line1.split(' ')[2]}
          </span>
          <br />
          {line2}
        </h1>

        <p className="text-muted text-[15px] font-medium leading-relaxed mt-5 max-w-md mx-auto">
          Poker nights, dinner parties, rooftop drinks and karaoke sessions — hosted by real people, with approval before you show up.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-7">
          <a
            href="https://app.nammane.in/auth/signup"
            className="nm-btn px-6 py-4 text-[14.5px] inline-flex items-center gap-2.5"
            style={{ background: '#fff', color: '#0d0b1a' }}
          >
            Find your night
            <span className="w-7 h-7 rounded-full bg-[#0d0b1a] text-white flex items-center justify-center text-[13px]">
              →
            </span>
          </a>
          <button className="nm-btn nm-btn-ghost px-6 py-4 text-[14.5px]">See it in action</button>
        </div>
      </div>

      <div className="relative mt-12 md:mt-14">
        <div
          className="relative h-[300px] sm:h-[360px] md:h-[420px] mx-auto scale-[0.56] xs:scale-[0.68] sm:scale-[0.85] md:scale-100 origin-top"
          style={{ width: 920 }}
        >
          {cards.map((c, idx) => (
            <FanCard key={c.key} c={c} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
