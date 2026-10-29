'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './hooks'

const LOGIN_URL = 'https://app.nammane.in/auth/login'

type Card = {
  name: string
  rank: string
  tag: string
  tagline: string
  cta: string
  img?: string
  gradient?: string
  icon?: string
}

const cards: Card[] = [
  { name: 'POKER', rank: 'A♠', tag: "Texas hold'em", tagline: 'Read the room. Raise the stakes.', cta: 'Take a seat', img: '/assets/cards/poker.jpeg' },
  { name: 'RUMMY', rank: 'K♦', tag: 'Sets & runs', tagline: 'Sets, runs and a little friendly trash talk.', cta: 'Deal me in', img: '/assets/cards/u4.jpeg' },
  { name: 'DISCO', rank: 'Q♥', tag: 'Dance floor', tagline: 'The DJ plays till sunrise. So do you.', cta: 'Hit the floor', img: '/assets/cards/disco2.jpeg' },
  { name: 'DINNER', rank: 'J♣', tag: 'Supper club', tagline: 'Strangers at seven. Friends by dessert.', cta: 'Book a seat', img: '/assets/cards/dinner.jpeg' },
  { name: 'KARAOKE', rank: '10♠', tag: 'Open mic', tagline: 'One mic, zero shame, standing ovation.', cta: 'Grab the mic', img: '/assets/cards/u6.jpeg' },
  { name: 'DRINKS', rank: '9♦', tag: 'Rooftop bars', tagline: 'Rooftops, sunsets and second rounds.', cta: 'First round', img: '/assets/cards/u5.jpeg' },
  { name: 'PARTY', rank: '8♥', tag: 'House parties', tagline: 'Doors open late. Volume stays up.', cta: 'Get on the list', img: '/assets/cards/party.jpeg' },
  { name: 'MOVIE', rank: '7♣', tag: 'Screenings', tagline: 'Big screen, small crowd, better snacks.', cta: 'Save a seat', img: '/assets/cards/movie.jpeg' },
  { name: 'GAMES', rank: '6♥', tag: 'Survival games', tagline: 'Play to win. Or at least to stay in.', cta: 'Enter the game', img: '/assets/cards/games.jpeg' },
  { name: 'OTHERS', rank: '?', tag: 'Secret plans', tagline: 'The nights nobody has named yet.', cta: 'Surprise me', img: '/assets/cards/others.jpeg' },
]

const AUTOPLAY_MS = 4500

function CardFace({ c, active }: { c: Card; active: boolean }) {
  return (
    <>
      {c.img ? (
        <img
          src={c.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms]"
          style={{ transform: active ? 'scale(1.04)' : 'scale(1.35)', filter: active ? 'none' : 'brightness(.42) saturate(.55)' }}
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-[1400ms]"
          style={{ background: c.gradient, transform: active ? 'scale(1.04)' : 'scale(1.1)', filter: active ? 'none' : 'brightness(.5)' }}
        >
          <i className={`ph ${c.icon}`} style={{ fontSize: active ? 'min(18vw,120px)' : '48px', color: 'rgba(255,255,255,.28)' }} />
        </div>
      )}

      {active && (
        <>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(0deg, rgba(5,5,15,.92) 0%, rgba(5,5,15,.15) 55%, transparent 80%)' }}
          />
          <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255,143,209,.45), inset 0 0 60px rgba(139,63,251,.25)' }} />
        </>
      )}

      {!active && (
        <>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(5,5,15,.8), transparent 60%)' }} />
          <span className="nm2-heading nm2-card-rank text-white/70 font-bold text-[13px]">
            {c.rank}
          </span>
          <span className="nm2-heading nm2-card-name text-white font-extrabold text-[13px]">
            {c.name}
          </span>
        </>
      )}
    </>
  )
}

export default function CategoryDeck() {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (reduced || hover) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / AUTOPLAY_MS)
      setProgress(p)
      if (p >= 1) {
        setActive((a) => (a + 1) % cards.length)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, hover, reduced])

  useEffect(() => {
    if (reduced) return
    const el = deckRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const mx = (e.clientX - r.left) / r.width - 0.5
      const my = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1400px) rotateY(${mx * 6}deg) rotateX(${-my * 6}deg)`
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <section
      className="relative py-10 sm:py-14 lg:py-24 px-5"
      style={{ background: 'radial-gradient(60% 70% at 50% 40%, rgba(28,18,64,.55), #06060F 72%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 justify-center mb-3">
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.25))' }} />
          <span className="nm2-kicker text-[var(--nm-text-meta)]">Ten kinds of night</span>
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,255,255,.25))' }} />
        </div>
        <h2 className="nm2-heading text-center text-white font-black" style={{ fontSize: 'clamp(32px,4.5vw,52px)' }}>
          DEAL YOURSELF <span className="nm2-grad-text">IN.</span>
        </h2>
        <p className="text-center text-[var(--nm-text-body)] mt-3 max-w-md mx-auto text-[15px]">
          Poker tables, dinner parties, dance floors and more, hosted by real people near you.
        </p>

        <div
          ref={deckRef}
          className="nm2-deck mt-12 flex gap-2 rounded-[20px] overflow-hidden"
          style={{ height: 'min(72vh,620px)', transformStyle: 'preserve-3d' }}
        >
          {cards.map((c, i) => {
            const isActive = i === active
            return (
              <div
                key={c.name}
                onMouseEnter={() => {
                  setHover(true)
                  setActive(i)
                  setProgress(0)
                }}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                  setActive(i)
                  setProgress(0)
                }}
                className={`nm2-card-${isActive ? 'active' : 'inactive'} relative cursor-pointer rounded-[20px] overflow-hidden ${mounted ? 'nm2-deck-enter' : 'opacity-0'}`}
                style={{
                  flex: isActive ? 5 : 1,
                  transition: 'flex .8s cubic-bezier(.77,0,.18,1)',
                  animationDelay: `${i * 0.07}s`,
                  minWidth: isActive ? undefined : 48,
                }}
              >
                <CardFace c={c} active={isActive} />

                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                    <div className="nm2-reveal nm2-kicker text-[var(--nm-blush)] mb-2" style={{ animationDelay: '.2s' }}>
                      {String(i + 1).padStart(2, '0')} / 10 · {c.rank}
                    </div>
                    <div
                      className="nm2-reveal nm2-heading text-white font-black leading-[0.95] mb-2"
                      style={{ fontSize: 'clamp(26px,3.6vw,50px)', animationDelay: '.3s' }}
                    >
                      {c.name}
                    </div>
                    <p className="nm2-reveal text-[var(--nm-text-body)] text-[14px] sm:text-[15px] mb-4 max-w-sm" style={{ animationDelay: '.38s' }}>
                      {c.tagline}
                    </p>
                    <a
                      href={LOGIN_URL}
                      onClick={(e) => e.stopPropagation()}
                      className="nm2-reveal nm2-grad-pill inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white"
                      style={{ animationDelay: '.46s' }}
                    >
                      {c.cta}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>

                    <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/10">
                      <div
                        className="h-full"
                        style={{ width: `${hover ? 0 : progress * 100}%`, background: 'var(--nm-grad)', transition: hover ? 'none' : 'width .1s linear' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
