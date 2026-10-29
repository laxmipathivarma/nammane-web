'use client'

import { useEffect, useRef, useState } from 'react'
import { usePointer, useReducedMotion } from './hooks'

const LOGIN_URL = 'https://app.nammane.in/auth/login'

const heroCards = [
  { key: 'host', tag: 'Host an Event', title: 'Host', img: '/assets/cards/x8.jpeg', pos: '50% 20%', desc: 'Set up your night, approve who joins, and keep control of your guest list.' },
  { key: 'join', tag: 'Join the Event', title: 'Join', img: '/assets/cards/x7.jpeg', pos: '50% 25%', desc: 'Request to join a night that fits your vibe and get approved by the host.' },
  { key: 'discover', tag: 'Discover', title: 'Discover', img: '/assets/cards/x6.jpeg', pos: '50% 15%', desc: 'Browse what’s happening around you tonight, filtered by category and city.' },
]

function Stars() {
  const stars = useRef<{ top: number; left: number; size: number; delay: number }[]>([])
  if (stars.current.length === 0) {
    for (let i = 0; i < 70; i++) {
      stars.current.push({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() < 0.8 ? 1.5 : 2.5, delay: Math.random() * 3 })
    }
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((s, i) => (
        <span key={i} className="nm2-star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  )
}

// Thumbnail on the left, tag/copy/CTA on the right -- side by side, never stacked.
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
        el.style.transform = `perspective(700px) rotateX(${-my * 10}deg) rotateY(${mx * 12}deg) translateY(-3px)`
      })
    }
    const onLeave = () => { el.style.transform = '' }
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
      href={LOGIN_URL}
      className="nm2-hero-card nm2-glass nm2-card-fade-up relative grid items-center gap-4 rounded-[20px] p-3 transition-transform duration-300"
      style={{ gridTemplateColumns: '112px 1fr', minHeight: 140, animationDelay: `${0.4 + idx * 0.12}s` }}
    >
      <div className="relative overflow-hidden rounded-[14px] nm2-image-grade" style={{ height: 118 }}>
        <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: c.pos }} />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="nm2-kicker rounded-full border border-white/20 px-2.5 py-1 text-[10px] text-[var(--nm-text-body)] normal-case tracking-[.12em]">
          {c.tag}
        </span>
        <p className="text-[13px] leading-[1.5] text-[var(--nm-text-body)]">{c.desc}</p>
        <span className="nm2-heading inline-flex items-center gap-2 rounded-full bg-white pl-3 pr-1.5 py-1 text-[10px] font-extrabold text-[#0a081c]">
          {c.title}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c23ffb" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function Hero() {
  const pointer = usePointer()
  const reduced = useReducedMotion()
  const artRef = useRef<HTMLImageElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const mobileArtRef = useRef<HTMLDivElement>(null)
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
        artRef.current.style.transform = `translate(-50%, -50%) perspective(900px) rotateX(${-my * 22}deg) rotateY(${mx * 26}deg) translate(${mx * 50}px, ${my * 30}px)`
      }
      if (lightRef.current) {
        lightRef.current.style.background = `radial-gradient(38vmin circle at ${50 + mx * 70}% ${45 + my * 60}%, rgba(255,143,209,.22), rgba(139,63,251,.08) 45%, transparent 70%)`
      }
      if (wordmarkRef.current) {
        wordmarkRef.current.style.transform = `translateY(${scrollY * 0.35}px) translateX(${-mx * 30}px)`
      }
      if (mobileArtRef.current) {
        // No cursor on a phone, so pointer.current is driven entirely by the
        // idle sine-drift in usePointer() once 2.5s have passed -- this is
        // what makes the mobile face gently rotate/sway on its own instead
        // of sitting dead still like a plain photo.
        mobileArtRef.current.style.transform = `perspective(600px) rotateY(${mx * 20}deg) rotateX(${-my * 10}deg) translateX(${mx * 16}px) scale(1.02)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pointer, reduced, scrollY])

  return (
    <section
      className="relative overflow-hidden flex flex-col sm:min-h-[100dvh]"
      style={{ background: 'radial-gradient(70% 60% at 50% 62%, rgba(194,63,251,.28), rgba(28,18,64,.6) 40%, #06060F 80%)' }}
    >
      <Stars />

      {/* Desktop decorative layer: wordmark + full-bleed cursor-reactive face,
          both sitting BEHIND the copy so the design can let text float over
          the face. Hidden on mobile -- on a narrow screen there's no room for
          text to share space with a life-size face without covering it, so
          mobile gets its own sequential layout below instead. */}
      <div className="hidden sm:block">
        <div
          ref={wordmarkRef}
          className="nm2-heading absolute inset-x-0 top-[12%] text-center font-black pointer-events-none select-none"
          style={{ fontSize: 'clamp(64px,15vw,230px)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.12)', lineHeight: 1 }}
        >
          NAMMANE
        </div>

        <img
          ref={artRef}
          src="/assets/hero.jpeg"
          alt=""
          className="select-none pointer-events-none"
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            height: 'min(118vh,1200px)',
            aspectRatio: '736/1104',
            maxWidth: 'none',
            mixBlendMode: 'lighten',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 46% at 50% 46%, #000 62%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 50% 46% at 50% 46%, #000 62%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div ref={lightRef} className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: 'screen' }} />
      </div>

      {/* Mobile face banner -- sits in normal document flow, fully visible,
          ABOVE the heading/copy (never overlapping it). Once this image ends,
          the text begins. Cursor-reactive on desktop has no equivalent on a
          phone, so it gets its own gentle auto-rotating tilt (driven by the
          same idle sine-drift the desktop face idles into when the pointer's
          been still) instead of sitting there static. */}
      <div className="sm:hidden relative z-[2] mx-auto mt-5 w-[86%] max-w-[360px]" style={{ perspective: 600 }}>
        <div
          ref={mobileArtRef}
          className="relative overflow-hidden rounded-[28px] nm2-image-grade"
          style={{ aspectRatio: '4/5', willChange: 'transform' }}
        >
          <img
            src="/assets/hero.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ objectPosition: '50% 18%' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(6,6,15,.55) 0%, transparent 42%)' }} />
        </div>
      </div>

      {/* Left copy + orb CTA -- flex-1 (which vertically centres and
          stretches to fill the section) only applies at sm+, where the
          section is pinned to 100dvh on purpose. On mobile the section has
          no forced height, so flex-1 here would stretch this block to fill
          whatever blank space min-h left over and shove the cards row down
          -- that's what was blowing out the gap between the copy and the
          cards below it. */}
      <div className="relative z-[3] flex sm:flex-1 items-start sm:items-center pt-5 sm:pt-0" style={{ padding: '20px clamp(18px,4vw,56px) 24px' }}>
        <div
          className="nm2-hero-copy-backing nm2-intro flex flex-col gap-[14px] sm:gap-[18px] max-w-full"
          style={{ width: '100%', maxWidth: 'min(420px, max(300px, 34vw))' }}
        >
          <div className="flex items-center gap-1.5 text-[11.5px] font-extrabold tracking-[0.12em] uppercase">
            <span className="text-white">Gather better.</span>
            <span className="nm2-grad-text">Live closer.</span>
          </div>
          <div className="nm2-kicker text-[var(--nm-blush)]">Poker · Dinner · Drinks · Dance · Karaoke</div>
          <h1 className="nm2-heading font-black leading-[0.98] text-white" style={{ fontSize: 'clamp(34px,4.4vw,60px)' }}>
            Find your kind of <span className="nm2-grad-text">night out</span>
          </h1>
          <div className="flex items-stretch gap-3.5">
            <span className="nm2-grad-bar w-[3px] rounded-sm shrink-0" />
            <div className="flex flex-col gap-3">
              <p className="nm2-tagline leading-[1.3] text-[var(--nm-text-meta)]">
                Bring your <span className="text-white not-italic font-extrabold">poker face</span>, an{' '}
                <span className="text-white not-italic font-extrabold">empty stomach</span> and your{' '}
                <span className="nm2-grad-text not-italic font-extrabold">worst karaoke song</span>. We&rsquo;ll handle the rest &mdash;
              </p>
              <p className="flex items-center gap-2.5 text-[13px] font-bold leading-[1.4] text-[var(--nm-text-body)]">
                <span className="nm2-grad-pill w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                </span>
                hosted by real people, with approval before you show up.
              </p>
            </div>
          </div>
        </div>

        {/* Orb CTA -- absolute right, vertically centred within this same wrapper */}
        <a
          href="https://app.nammane.in/discover"
          className="nm2-bob absolute hidden sm:block"
          style={{ right: 'clamp(18px,4vw,56px)', top: '50%', marginTop: -90, width: 180, height: 180 }}
          aria-label="Find your night"
        >
          <span
            className="nm2-spin-slow absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #8B3FFB, #C23FFB, #FF4F9E, #4CC9F0, #8B3FFB)',
              WebkitMask: 'radial-gradient(circle, transparent 66%, #000 67%, #000 69%, transparent 70%)',
              mask: 'radial-gradient(circle, transparent 66%, #000 67%, #000 69%, transparent 70%)',
              filter: 'drop-shadow(0 0 8px #c23ffb)',
            }}
          />
          <span className="nm2-ripple absolute rounded-full border border-[var(--nm-pink)]/50" style={{ inset: 40 }} />
          <span
            className="absolute rounded-full flex items-center justify-center"
            style={{ inset: 40, background: 'radial-gradient(circle at 32% 28%, #F1D6FF, #C23FFB 38%, #8B3FFB 70%, #3A1466)', boxShadow: 'inset -10px -12px 24px rgba(10,8,28,.55), inset 8px 8px 18px rgba(255,255,255,.35), 0 16px 40px rgba(139,63,251,.55)' }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </a>
      </div>

      {/* Hero cards -- side by side, auto-fit row (never a vertical column) */}
      <div
        className="nm2-hero-cards relative z-[4]"
        style={{ padding: '0 clamp(18px,4vw,56px) 28px' }}
      >
        {heroCards.map((c, i) => (
          <HeroCard key={c.key} c={c} idx={i} />
        ))}
      </div>
    </section>
  )
}
