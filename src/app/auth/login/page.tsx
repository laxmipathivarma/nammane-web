'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Sign-in wiring lands with Supabase Auth session support.
    window.location.href = '/discover'
  }

  return (
    <AuthShell>
      <h1 className="nm-marquee text-3xl text-ink font-extrabold">Welcome home</h1>
      <p className="text-[#5a5245] text-[13.5px] font-medium mt-2 mb-7">
        Sign in to see what&apos;s happening at your place.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="nm-label !text-[#8a7d68] !mb-0">Password</label>
            <Link href="/auth/forgot" className="text-[11px] font-bold text-gold-dark">
              Forgot?
            </Link>
          </div>
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
          {loading ? 'Signing in…' : 'Sign in'}
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
        New to NamMane?{' '}
        <Link href="/auth/signup" className="text-gold-dark font-bold">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
