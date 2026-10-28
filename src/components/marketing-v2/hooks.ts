'use client'

import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Window-level pointer tracker, normalised to -0.5..0.5, lerped toward the
 * target each frame. Falls back to a gentle sine idle-drift 2.5s after the
 * last real pointer movement. Returns a ref (not state) so consumers can
 * read per-frame values without re-rendering the whole tree.
 */
export function usePointer() {
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const lastMove = useRef(0)
  const reduced = useRef(prefersReducedMotion())

  useEffect(() => {
    if (reduced.current) return
    const onMove = (clientX: number, clientY: number) => {
      target.current.x = clientX / window.innerWidth - 0.5
      target.current.y = clientY / window.innerHeight - 0.5
      lastMove.current = performance.now()
    }
    const mouse = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const touch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) onMove(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', mouse, { passive: true })
    window.addEventListener('touchmove', touch, { passive: true })

    let raf = 0
    const tick = (t: number) => {
      const idleFor = t - lastMove.current
      if (idleFor > 2500) {
        const s = t / 1000
        target.current.x = Math.sin(s * 0.45) * 0.3
        target.current.y = Math.cos(s * 0.33) * 0.22
      }
      pos.current.x += (target.current.x - pos.current.x) * 0.08
      pos.current.y += (target.current.y - pos.current.y) * 0.08
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', mouse)
      window.removeEventListener('touchmove', touch)
      cancelAnimationFrame(raf)
    }
  }, [])

  return pos
}

/** rAF clock in seconds, with a setInterval fallback so motion never stalls. */
export function useClock() {
  const t = useRef(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      t.current = (now - start) / 1000
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const interval = setInterval(() => {
      t.current = (performance.now() - start) / 1000
    }, 250)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(interval)
    }
  }, [])
  return t
}

/** IntersectionObserver, threshold 0.2, returns [ref, inView]. */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(prefersReducedMotion()), [])
  return reduced
}
