'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'

const blobs = [
  {
    style: {
      position: 'absolute' as const,
      width: 440,
      height: 440,
      right: -170,
      top: -150,
      borderRadius: 999,
      background: 'radial-gradient(circle,#4cc9f0,transparent 70%)',
      opacity: 0.45,
      filter: 'blur(10px)',
    },
  },
  {
    style: {
      position: 'absolute' as const,
      width: 360,
      height: 360,
      left: -150,
      top: 420,
      borderRadius: 999,
      background: 'radial-gradient(circle,#8b3ffb,transparent 70%)',
      opacity: 0.5,
      filter: 'blur(10px)',
    },
  },
]

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
    <AuthShell blobs={blobs}>
      <div className="flex flex-col items-center text-center">
        <div className="nm-logo-mark w-16 h-16 text-[28px]" style={{ width: 64, height: 64 }}>N</div>

        <h1 className="nm-marquee text-[27px] text-white mt-6 mb-1.5">
          Welcome{' '}
          <span style={{ background: 'linear-gradient(120deg,#c57bff,#ff6fc2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            back
          </span>
        </h1>
        <p className="text-[13.5px] text-muted font-medium mb-7 max-w-[300px] leading-relaxed">
          Sign in to see your next approved night out.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="nm-label !mb-0">PASSWORD</label>
              <Link href="/auth/forgot" className="text-[12px] font-bold text-[#ff8fd1]">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="nm-field"
            />
          </div>

          <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-6 w-full">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-bold text-[#8a81ab]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="flex gap-3 w-full">
          <button type="button" className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
            Google
          </button>
          <button type="button" className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
            Apple
          </button>
        </div>

        <p className="text-muted text-[13px] mt-7 font-bold">
          New to NamMane?{' '}
          <Link href="/auth/signup" className="text-[#ff8fd1]">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
