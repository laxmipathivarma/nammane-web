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
      <h1 className="nm-marquee text-3xl text-ink font-extrabold">Join the party</h1>
      <p className="text-[#5a5245] text-[13.5px] font-medium mt-2 mb-7">
        Host game nights, dinners, dance parties and birthdays at home.
      </p>

      {error && (
        <div className="bg-ruby/10 border border-ruby/40 text-[#9c3344] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="nm-label !text-[#8a7d68]">Full name</label>
          <input type="text" placeholder="Your name" required className="nm-field" />
        </div>
        <div>
          <label className="nm-label !text-[#8a7d68]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="nm-field"
          />
        </div>
        <div>
          <label className="nm-label !text-[#8a7d68]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            className="nm-field"
          />
        </div>

        <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-3.5 text-[14px] disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#ddd3bd]" />
        <span className="text-[#8a7d68] text-xs font-semibold">or</span>
        <div className="flex-1 h-px bg-[#ddd3bd]" />
      </div>

      <div className="space-y-3">
        <button type="button" className="nm-btn w-full py-3.5 text-[13.5px] bg-ink2 text-white">
          Continue with Google
        </button>
        <button type="button" className="nm-btn w-full py-3.5 text-[13.5px] bg-ink2 text-white">
          Continue with Apple
        </button>
      </div>

      <p className="text-center text-[#8a7d68] text-[13px] mt-7 font-medium">
        Already a member?{' '}
        <Link href="/auth/login" className="text-gold-dark font-bold">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
