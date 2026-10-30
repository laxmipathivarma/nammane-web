'use client'

import { useRef } from 'react'

// A verification code as one box per digit, instead of a single free-text
// field. Supabase's own email OTP has a fixed length that can't be
// shortened (it enforces 6-10 digits project-wide, no dashboard setting for
// it) -- `length` just needs to match whatever this project is configured
// to send, so it's a prop rather than hardcoded.
export default function OtpInput({
  length,
  value,
  onChange,
  autoFocus = true,
}: {
  length: number
  value: string
  onChange: (next: string) => void
  autoFocus?: boolean
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const setDigit = (index: number, digit: string) => {
    const next = value.split('')
    while (next.length < length) next.push('')
    next[index] = digit
    onChange(next.join('').slice(0, length))
  }

  const handleChange = (index: number, raw: string) => {
    // Typing a digit over an existing one, or pasting into a single box,
    // both land here -- keep only digits and take however many fit from
    // this box onward.
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      setDigit(index, '')
      return
    }
    const next = value.split('')
    while (next.length < length) next.push('')
    for (let i = 0; i < digits.length && index + i < length; i++) {
      next[index + i] = digits[i]
    }
    const merged = next.join('').slice(0, length)
    onChange(merged)
    const landingIndex = Math.min(index + digits.length, length - 1)
    inputsRef.current[landingIndex]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return
    e.preventDefault()
    handleChange(index, pasted)
  }

  return (
    <div className="flex gap-2 justify-between">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoFocus={autoFocus && i === 0}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          maxLength={1}
          className="nm-field text-center !px-0 font-extrabold text-[18px]"
          style={{ width: `calc((100% - ${(length - 1) * 8}px) / ${length})`, minWidth: 0 }}
        />
      ))}
    </div>
  )
}
