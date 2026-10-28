'use client'

import { useEffect, useRef, useState } from 'react'
import { usePointer, useReducedMotion } from './hooks'

const LOGIN_URL = 'https://app.nammane.in/auth/login'

const heroCards = [
  { key: 'host', tag: 'Host an Event', title: 'Host', img: '/assets/cards/x8.jpeg', desc: 'Set up your night, approve who joins, and keep control of your guest list.', href: LOGIN_URL },
  { key: 'join', tag: 'Join the Event', title: 'Join', img: '/assets/cards/x7.jpeg', desc: 'Request to join a night that fits your vibe and get approved by the host.', href: LOGIN_URL },
  { key: 'discover', tag: 'Discover', title: 'Discover', img: '/assets/cards/x6.jpeg', desc: 'Browse what’s happening around you tonight, filtered by category and city.', href: LOGIN_URL },
]

function Stars() {
  const stars = useRef<{ top: number; left: number; size: number; delay: number }[]>([])
  if (stars.current.length === 0) {
    for (let i = 0; i < 70; i++) {
      stars.current.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.8 ? 1.5 : 2.5,
        delay: Math.random() * 3,
      })
    }
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((s, i) => (
        <span
          key={i}
          className="nm2-star"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}

function HeroCard({ c, idx }: { c: (typeof heroCards)[number]; idx: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const mx = (e.clientX - r.left) / r.width - 0.5
      const my = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(700px) rotateX(${-my * 14}deg) rotateY(${mx * 16}deg) translateY(-4px)`
      })
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <a
      ref={ref}
      href={c.href}
      className="nm2-glass nm2-card-fade-up rounded-[22px] p-4 flex flex-col gap-3 transition-transform duration-300"
      style={{ animationDelay: `${0.4 + idx * 0.12}s` }}
    >
      <div className="relative w-full rounded-[14px] overflow-hidden nm2-image-grade" style={{ height: 118 }}>
        <img src={c.img} alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.08)' }} />
      </div>
      <div>
        <div className="nm2-kicker text-[var(--nm-blush)] mb-1">{c.tag}</div>
        <p className="text-[13px] leading-snug text-[var(--nm-text-body)]">{c.desc}</p>
      </div>
      <span className="mt-auto nm2-heading text-white text-[12px] font-bold inline-flex items-center gap-1.5">
        {c.title}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  )
}

export default function Hero() {
  const pointer = usePointer()
  const reduced = useReducedMotion()
  const artRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = () => {
      const { x: mx, y: my } = pointer.current
      if (artRef.current) {
        artRef.current.style.transform = `perspective(900px) rotateX(${-my * 22}deg) rotateY(${mx * 26}deg) translate(${mx * 50}px, ${my * 30}px)`
      }
      if (lightRef.current) {
        lightRef.current.style.background = `radial-gradient(38vmin circle at ${50 + mx * 70}% ${45 + my * 60}%, rgba(255,143,209,.22), rgba(139,63,251,.08) 45%, transparent 70%)`
      }
      if (wordmarkRef.current) {
        wordmarkRef.current.style.transform = `translateY(${scrollY * 0.35}px) translateX(${-mx * 30}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pointer, reduced, scrollY])

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(70% 60% at 50% 62%, rgba(194,63,251,.28), rgba(28,18,64,.6) 40%, #06060F 80%)',
      }}
    >
      <Stars />

      <div
        ref={wordmarkRef}
        className="nm2-heading absolute inset-x-0 top-[6%] text-center font-black pointer-events-none select-none"
        style={{
          fontSize: 'clamp(64px,15vw,230px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,.12)',
          lineHeight: 1,
        }}
      >
        NAMMANE
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-5 grid lg:grid-cols-[380px_1fr] gap-10 items-center pt-16 pb-10">
        {/* Left copy */}
        <div className="nm2-intro relative z-10">
          <div className="nm2-kicker text-[var(--nm-blush)] mb-4">Poker · Dinner · Drinks · Dance · Karaoke</div>
          <h1 className="nm2-heading text-white font-black leading-[0.95]" style={{ fontSize: 'clamp(36px,5vw,56px)' }}>
            FIND YOUR KIND OF <span className="nm2-grad-text">NIGHT OUT</span>
          </h1>
          <p className="nm2-tagline relative pl-4 mt-6 text-white">
            <span className="nm2-grad-bar absolute left-0 top-0 bottom-0 w-[3px] rounded-full" />
            Bring your <b className="font-extrabold">poker face</b>, an <b className="font-extrabold">empty stomach</b> and your{' '}
            <b className="nm2-grad-text font-extrabold">worst karaoke song</b>. We&rsquo;ll handle the rest &mdash;
          </p>
          <div className="mt-5 flex items-center gap-2.5 text-[14px] text-[var(--nm-text-body)]">
            <span className="nm2-grad-pill w-5 h-5 rounded-full flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L19 7" />
              </svg>
            </span>
            hosted by real people, with approval before you show up.
          </div>

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-[560px]">
            {heroCards.map((c, i) => (
              <HeroCard key={c.key} c={c} idx={i} />
            ))}
          </div>
        </div>

        {/* Hero art */}
        <div className="relative hidden lg:flex items-center justify-center h-full">
          <div
            ref={artRef}
            className="nm2-float relative"
            style={{ height: 'min(70vh,620px)', transformStyle: 'preserve-3d' }}
          >
            <img
              src="/assets/hero.jpeg"
              alt=""
              className="h-full w-auto object-contain select-none pointer-events-none"
              style={{
                mixBlendMode: 'lighten',
                WebkitMaskImage: 'radial-gradient(circle at 50% 45%, #000 60%, transparent 90%)',
                maskImage: 'radial-gradient(circle at 50% 45%, #000 60%, transparent 90%)',
              }}
            />
          </div>
          <div ref={lightRef} className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: 'screen' }} />

          {/* Orb CTA */}
          <a
            href="https://app.nammane.in/discover"
            className="nm2-bob absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ width: 180, height: 180 }}
            aria-label="Find your night"
          >
            <span
              className="nm2-spin-slow absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #8B3FFB, #C23FFB, #FF4F9E, #4CC9F0, #8B3FFB)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
              }}
            />
            <span className="nm2-ripple absolute inset-0 rounded-full border border-[var(--nm-pink)]/50" />
            <span
              className="absolute rounded-full flex items-center justify-center"
              style={{
                inset: 40,
                background: 'radial-gradient(circle at 32% 28%, #F1D6FF, #C23FFB 38%, #8B3FFB 70%, #3A1466)',
                boxShadow: 'inset 0 -8px 20px rgba(0,0,0,.35), inset 0 6px 14px rgba(255,255,255,.3)',
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <span className="absolute inset-x-0 -bottom-7 text-center nm2-heading text-white text-[11px] font-bold">Find your night</span>
          </a>
        </div>
      </div>
    </section>
  )
}
