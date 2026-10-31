'use client'

import { useEffect, useState } from 'react'
import { KineticTextLoader } from '@/components/ui/kinetic-text-loader'

// Wraps KineticTextLoader so it only appears once something has actually
// been loading for a while -- per the product rule: a load under ~1s
// should feel instant (no loader flash at all), only a load that runs
// past that gets the branded loader. Mount this only while the real
// `loading` condition is true; it renders nothing until `delayMs` has
// elapsed, then fades the loader in.
export default function DelayedLoader({
  delayMs = 1000,
  className = 'py-16',
}: {
  delayMs?: number
  className?: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  if (!show) return null

  return (
    <div className={className} style={{ animation: 'nm-fade-in 200ms ease-out' }}>
      <KineticTextLoader className="scale-[0.4] sm:scale-50" />
    </div>
  )
}
