'use client'

import { useEffect, useRef } from 'react'
import { usePointer, useClock, useReducedMotion } from '@/components/marketing-v2/hooks'
import { RepelWords } from '@/components/RepelWords'

const SIGNUP_URL = '/auth/signup'
const LOGIN_URL = '/auth/login'

function ease(x: number) {
  const c = Math.min(1, Math.max(0, x))
  return 1 - Math.pow(1 - c, 3)
}

function Stars() {
  const stars = useRef<{ top: number; left: number; size: number; delay: number; color: string }[]>([])
  if (stars.current.length === 0) {
    const colors = ['#ffffff', '#cfc9e6', '#ff8fd1', '#4cc9f0', '#c23ffb']
    for (let i = 0; i < 90; i++) {
      stars.current.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 0.8 + Math.random() * 1.8,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((s, i) => (
        <span
          key={i}
          className="nm2-star"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, background: s.color, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}

/**
 * The "NamMane Web App" entry hero -- the 3D paper-cut space scene (cave,
 * Saturn, Jupiter, a drifting astronaut) from the webapp design handoff,
 * rebuilt as a client component. Pointer/touch-driven on desktop, idles
 * into a gentle auto-drift (same mechanism as the marketing hero) when
 * nothing's moving it, which is also what keeps it animated on mobile.
 */
export default function WebAppHero3D({ signedIn = false }: { signedIn?: boolean }) {
  const pointer = usePointer()
  const clock = useClock()
  const reduced = useReducedMotion()

  const sceneRef = useRef<HTMLDivElement>(null)
  const caveRef = useRef<HTMLDivElement>(null)
  const caveLightRef = useRef<HTMLDivElement>(null)
  const satRef = useRef<HTMLDivElement>(null)
  const jupRef = useRef<HTMLDivElement>(null)
  const astroRef = useRef<HTMLDivElement>(null)
  const astroImgRef = useRef<HTMLDivElement>(null)
  const visorRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Freeze the idle drift/parallax for reduced-motion users, but still run
    // the entrance fade once so the copy and scene aren't left at opacity 0.
    if (reduced) {
      if (copyRef.current) {
        copyRef.current.style.opacity = '1'
        copyRef.current.style.transform = 'none'
      }
      ;[caveRef, satRef, jupRef, astroRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1'
      })
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = clock.current
      const e = ease((performance.now() - start) / 1800)
      const { x: mx, y: my } = pointer.current
      const k = 1

      if (sceneRef.current) {
        sceneRef.current.style.transform = `translateZ(${(1 - e) * -500}px) rotateY(${mx * 22 * k}deg) rotateX(${-my * 16 * k}deg) translateY(${Math.sin(t * 0.9) * 10}px)`
      }
      if (caveRef.current) {
        caveRef.current.style.transform = `translate3d(${-mx * 26 * k}px, ${-my * 20 * k}px, -140px) scale(1.12)`
        caveRef.current.style.opacity = String(e)
      }
      if (caveLightRef.current) {
        caveLightRef.current.style.background = `radial-gradient(40% 30% at ${50 + mx * 50}% ${45 + my * 40}%, rgba(194,63,251,.22), rgba(76,201,240,.06) 50%, transparent 75%)`
      }
      if (satRef.current) {
        const satE = ease((t - 0.4) / 1.3)
        satRef.current.style.transform = `translate3d(${mx * 40 * k + Math.sin(t * 0.22) * 10}px, ${my * 30 * k + Math.sin(t * 0.3) * 10}px, ${60 + (1 - satE) * 500}px) rotate(${Math.sin(t * 0.18) * 4 + mx * 4}deg)`
        satRef.current.style.opacity = String(satE)
      }
      if (jupRef.current) {
        const jupE = ease((t - 0.55) / 1.3)
        jupRef.current.style.transform = `translate3d(${mx * 50 * k + Math.cos(t * 0.26 + 1) * 10}px, ${my * 56 * k + Math.sin(t * 0.34 + 2) * 12}px, ${200 + (1 - jupE) * 500}px) rotate(${(t * 4) % 360}deg)`
        jupRef.current.style.opacity = String(jupE)
      }
      if (astroRef.current) {
        const fx = Math.sin(t * 0.32) * 34 + Math.sin(t * 0.71) * 8
        const breath = Math.sin(t * 1.1)
        const fy = Math.sin(t * 0.64) * 22 + Math.cos(t * 0.41) * 10
        const fz = 90 + Math.sin(t * 0.27) * 50
        astroRef.current.style.transform = `translate3d(${fx + mx * 34 * k}px, ${fy + my * 22 * k + breath * 4}px, ${fz}px) rotateY(${mx * 16 * k + Math.sin(t * 0.32 + 1.2) * 10}deg) rotateX(${-my * 10 * k + Math.cos(t * 0.5) * 5}deg) rotateZ(${Math.sin(t * 0.32 + 0.6) * 9 + Math.sin(t * 0.9) * 2 + mx * 3}deg)`
        astroRef.current.style.opacity = String(e)
      }
      if (astroImgRef.current) {
        astroImgRef.current.style.filter = `drop-shadow(${-mx * 24}px ${26 - my * 12}px 26px rgba(0,0,0,.7)) drop-shadow(${mx * 6}px 0 18px rgba(194,63,251,.35))`
      }
      if (visorRef.current) {
        visorRef.current.style.background = `radial-gradient(60% 45% at ${36 + mx * 40}% ${30 + my * 30}%, rgba(255,255,255,.55), rgba(255,143,209,.25) 30%, transparent 60%), radial-gradient(80% 60% at ${70 - mx * 40}% ${78 - my * 30}%, rgba(76,201,240,.35), transparent 60%), linear-gradient(${130 + mx * 40}deg, transparent 40%, rgba(194,63,251,.35) 50%, transparent 60%)`
        visorRef.current.style.boxShadow = `0 0 ${18 + Math.sin(t * 2) * 6}px rgba(194,63,251,.55), inset 0 0 18px rgba(76,201,240,.25)`
      }
      if (copyRef.current) {
        const copyE = ease((performance.now() - start - 400) / 1000)
        copyRef.current.style.opacity = String(copyE)
        copyRef.current.style.transform = `translateY(${(1 - copyE) * 30}px)`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pointer, clock])

  return (
    <section
      className="relative overflow-hidden flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 px-5 lg:px-[clamp(18px,5vw,56px)] py-6 lg:py-0 lg:min-h-[100dvh]"
      style={{ background: '#06060F' }}
    >
      {/* Full-bleed cave backdrop -- the same paper-cut space-cave art used
          tight behind the astronaut now also washes across the whole
          section (not just its own small box), so the hero reads as one
          continuous scene instead of a graphic floating on flat black.
          Dimmed and vignetted so the copy column stays readable over it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/webapp/a2-cave2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '66% 42%',
          opacity: 0.55,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #06060F 0%, rgba(6,6,15,.85) 22%, rgba(6,6,15,.25) 55%, rgba(6,6,15,.55) 100%), radial-gradient(60% 70% at 50% 100%, rgba(6,6,15,.7), transparent 60%)',
        }}
      />
      <Stars />

      {/* Copy column */}
      <div
        ref={copyRef}
        className="relative z-[6] order-2 lg:order-1 flex flex-col gap-[22px] mx-auto lg:mx-0 -mt-20 lg:mt-0"
        style={{
          maxWidth: 'min(460px, 88vw)',
          padding: 24,
          borderRadius: 28,
          background: 'radial-gradient(120% 90% at 0% 50%, rgba(6,6,15,.78), rgba(6,6,15,0) 80%)',
        }}
      >
        <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.26em]" style={{ color: 'var(--nm-blush)' }}>
          <span className="w-7 h-px" style={{ background: 'linear-gradient(90deg, transparent, #ff4f9e)' }} />
          NamMane web app
        </div>
        <h1
          className="nm2-heading font-black uppercase text-white"
          style={{ fontSize: 'clamp(44px,9vw,72px)', lineHeight: 0.95, letterSpacing: '-0.02em', textShadow: '0 6px 30px rgba(6,6,15,.8)' }}
        >
          <RepelWords text="Gather better." />
          <br />
          <RepelWords text="Live closer." letterClassName="nm2-grad-text" />
        </h1>
        <div className="flex items-stretch gap-3.5">
          <span className="nm2-grad-bar w-[3px] rounded-sm shrink-0" />
          <p className="italic font-extrabold leading-[1.3] text-[var(--nm-text-meta)]" style={{ fontSize: 'clamp(19px,4.2vw,22px)' }}>
            <span className="text-white not-italic">Strangers at seven,</span>{' '}
            <span className="nm2-grad-text not-italic">friends by dessert.</span>
          </p>
        </div>
        {!signedIn && (
          <div className="flex flex-wrap gap-3 pt-1.5">
            <a
              href={SIGNUP_URL}
              className="nm2-grad-pill inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 h-[52px] text-[13px] font-extrabold uppercase tracking-[.12em] text-white hover:-translate-y-0.5 transition-transform"
            >
              Create account
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c23ffb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
            <a
              href={LOGIN_URL}
              className="nm2-glass nm2-btn-ghost inline-flex items-center rounded-full px-6 h-[52px] text-[13px] font-extrabold uppercase tracking-[.12em] text-white hover:border-[var(--nm-cyan)] transition-colors"
            >
              I have an account
            </a>
          </div>
        )}
      </div>

      {/* 3D scene -- notably smaller on mobile (w-[58vw], capped at 260px)
          so it doesn't dominate the first screen and push the headline
          below the fold. On desktop it's sized to fill the page (up to
          620px) and sits close to the copy column (the outer section's
          gap was tightened from gap-10 to gap-4 to match); aspect-ratio
          is untouched so the art itself never looks stretched or cropped. */}
      <div
        className="relative z-[3] order-1 lg:order-2 mx-auto lg:mx-0 shrink-0 w-[min(58vw,260px)] lg:w-[min(46vw,620px)]"
        style={{
          aspectRatio: '736/1380',
          perspective: 1200,
          overflow: 'clip',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 48%, #000 48%, transparent 78%)',
          maskImage: 'radial-gradient(ellipse 50% 50% at 50% 48%, #000 48%, transparent 78%)',
        }}
      >
        <div ref={sceneRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
          <div
            ref={caveRef}
            role="img"
            aria-label="Paper-cut space cave"
            className="absolute"
            style={{ inset: '-6%', backgroundImage: 'url(/assets/webapp/a2-cave2.jpg)', backgroundSize: '100% 100%', willChange: 'transform' }}
          />
          <div ref={caveLightRef} className="absolute inset-0" style={{ mixBlendMode: 'screen' }} />
          <div
            ref={satRef}
            className="absolute"
            style={{
              left: '3.75%', top: '3.72%', width: '48.1%', height: '18.36%',
              backgroundImage: 'url(/assets/webapp/a2-saturn.png)', backgroundSize: '100% 100%',
              filter: 'drop-shadow(0 0 30px rgba(255,79,158,.45))', willChange: 'transform, opacity',
            }}
          />
          <div
            ref={jupRef}
            className="absolute"
            style={{
              left: '60%', top: '25.5%', width: '26%', height: '13.9%',
              backgroundImage: 'url(/assets/webapp/a2-jupiter.png)', backgroundSize: '100% 100%',
              filter: 'drop-shadow(0 0 26px rgba(76,201,240,.4)) drop-shadow(-10px 18px 18px rgba(0,0,0,.6))', willChange: 'transform, opacity',
            }}
          />
          <div
            ref={astroRef}
            className="absolute"
            style={{ left: '29.21%', top: '40%', width: '43.48%', height: '47.1%', transformStyle: 'preserve-3d', transformOrigin: '50% 40%', willChange: 'transform, opacity' }}
          >
            <div
              ref={astroImgRef}
              role="img"
              aria-label="Astronaut floating in space"
              className="absolute inset-0"
              style={{ backgroundImage: 'url(/assets/webapp/a2-astronaut.png)', backgroundSize: '100% 100%' }}
            />
            <div
              ref={visorRef}
              className="absolute rounded-full"
              style={{ left: '24%', top: '6.6%', width: '50%', height: '21%', mixBlendMode: 'screen' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
