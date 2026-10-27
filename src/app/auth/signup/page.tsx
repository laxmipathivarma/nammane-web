'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Signup failed')
      }

      window.location.href = '/discover'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <div className="flex items-center gap-3 mb-7">
        <div className="relative inline-flex">
          <div className="nm-logo-mark w-13 h-13 text-[23px]" style={{ width: 52, height: 52 }}>N</div>
        </div>
        <div>
          <div className="nm-head font-extrabold text-[19px]">NamMane</div>
          <div className="text-[11px] font-bold text-[#a79ecb]">Poker · Dinner · Drinks · Karaoke</div>
        </div>
      </div>

      <h1 className="nm-marquee text-[28px] leading-tight text-white">
        Create your{' '}
        <span style={{ background: 'linear-gradient(120deg,#c57bff,#ff6fc2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          NamMane
        </span>{' '}
        account
      </h1>
      <p className="text-[13.5px] text-muted font-medium mt-1.5 mb-6 leading-relaxed">
        Join hosts and guests across India&apos;s biggest nights out — every event approved before you show up.
      </p>

      {error && (
        <div className="bg-ruby/10 border border-ruby/40 text-[#ff8fd1] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="nm-label">FULL NAME</label>
          <input type="text" placeholder="Your name" required className="nm-field" />
        </div>
        <div>
          <label className="nm-label">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="nm-field"
          />
        </div>
        <div>
          <label className="nm-label">PHONE NUMBER</label>
          <input type="tel" placeholder="+91 98765 43210" className="nm-field" />
        </div>
        <div>
          <label className="nm-label">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="nm-field"
          />
        </div>

        <label className="flex items-start gap-2.5 pt-1">
          <input type="checkbox" required className="mt-0.5 accent-[#b968ff]" />
          <span className="text-[11.5px] text-[#a79ecb] font-medium leading-relaxed">
            I agree to the Terms of Service and Host Approval Guidelines
          </span>
        </label>

        <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
      </form>

      <div className="flex items-center gap-2.5 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[11px] font-bold text-[#8a81ab]">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="flex gap-3">
        <button type="button" className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
          Google
        </button>
        <button type="button" className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
          Apple
        </button>
      </div>

      <p className="text-center text-muted text-[13px] mt-7 font-bold">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#ff8fd1]">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
