'use client'

import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from './hooks'

function TiltPanel({
  img,
  className,
  children,
}: {
  img: string
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = ref.current?.closest('section')
    if (!section) return
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect()
      const mx = (e.clientX - r.left) / r.width - 0.5
      const my = (e.clientY - r.top) / r.height - 0.5
      if (ref.current) {
        ref.current.style.transform = `perspective(900px) rotateY(${mx * 16}deg) rotateX(${-my * 12}deg)`
      }
    }
    section.addEventListener('mousemove', onMove)
    return () => section.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <div
      ref={ref}
      className={`nm2-image-grade relative overflow-hidden rounded-[24px] transition-transform duration-300 ${className ?? ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      {children}
    </div>
  )
}

const stats = [
  { value: '10+', label: 'Event categories — poker, rummy, drinks, dinner, karaoke & more' },
  { value: '100%', label: 'Host-approved guests, on every event' },
  { value: '8', label: 'Major metro cities across India, and growing' },
]

export default function Explore() {
  const [ref, inView] = useInView<HTMLElement>(0.2)

  return (
    <section ref={ref} className="relative py-12 sm:py-16 lg:py-24 px-5 bg-[var(--nm-base)]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: two tilt panels */}
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-4" style={{ height: 'clamp(380px,46vw,560px)' }}>
          <TiltPanel img="/assets/cards/hoop.jpeg" className={inView ? 'nm2-card-fade-up' : 'opacity-0'}>
            <div className="absolute top-4 left-4 nm2-glass rounded-full px-3.5 py-2 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[var(--nm-pink)] nm2-pulse" />
              Game on
            </div>
          </TiltPanel>
          <TiltPanel img="/assets/cards/ace.jpeg" className={inView ? 'nm2-card-fade-up' : 'opacity-0'} >
            <div className="absolute right-0 top-0 bottom-0 w-[5px]" style={{ background: 'var(--nm-grad)' }} />
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white flex items-center justify-center nm2-pulse">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1C1240"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div className="absolute left-5 right-4 bottom-6">
              <div
                className="nm2-heading font-black text-white text-[7.5vw] sm:text-[34px] leading-none relative whitespace-nowrap"
                style={{ WebkitTextStroke: '1.5px rgba(255,79,158,.7)' }}
              >
                TONIGHT
              </div>
            </div>
          </TiltPanel>
        </div>

        {/* Right copy */}
        <div className={inView ? 'nm2-card-fade-up' : 'opacity-0'}>
          <h2 className="nm2-heading text-white font-black" style={{ fontSize: 'clamp(32px,4vw,48px)' }}>
            GATHER BETTER. <span className="nm2-grad-text">LIVE CLOSER.</span>
          </h2>

          <div className="my-6 flex items-center gap-5">
            <div className="relative w-[110px] h-[110px] shrink-0">
              <svg viewBox="0 0 100 100" className="nm2-spin-slow-rev w-full h-full">
                <defs>
                  <path id="nm2-badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fill="var(--nm-text-meta)" fontSize="7.3" fontWeight={700} letterSpacing="2">
                  <textPath href="#nm2-badge-circle">GATHER BETTER • LIVE CLOSER • GATHER BETTER • LIVE CLOSER •</textPath>
                </text>
              </svg>
              <span
                className="absolute inset-0 m-auto w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--nm-grad)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </div>
            <p className="text-[var(--nm-text-body)] text-[15px] max-w-[260px]">
              Community-driven gatherings, hosted by people you trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.value} className="nm2-stat-tile p-5">
                <div className="nm2-heading text-white font-black text-[30px] mb-1.5">{s.value}</div>
                <div className="text-[var(--nm-text-muted)] text-[12.5px] leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
