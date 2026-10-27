'use client'

import Link from 'next/link'
import { useState } from 'react'

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
    <div className="nm-root nm-bg min-h-screen flex items-center justify-center px-5 text-[#f5efe3]">
      <div className="w-full max-w-md nm-card rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <svg width="40" height="40" viewBox="0 0 120 120" className="mb-2">
            <use href="#nm-mark" />
          </svg>
          <h1 className="nm-marquee text-2xl text-gold-text">Join NamMane</h1>
          <p className="text-[12px] text-muted font-semibold mt-1">Find your table</p>
        </div>

        {error && (
          <div className="bg-ruby/10 border border-ruby/40 text-[#f3b3bc] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="nm-label">Email</label>
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
            <label className="nm-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="nm-field"
            />
          </div>

          <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-3.5 text-[14px] disabled:opacity-50">
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-muted text-[13px] mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gold-text font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
