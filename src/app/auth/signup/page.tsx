'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'
import BackButton from '@/components/BackButton'
import { createClient } from '@/lib/supabase'
import { toE164India, sanitizeIndianMobileInput } from '@/lib/phone'

export default function SignupPage() {
  // Email/password and mobile+OTP are two separate ways to create the same
  // account -- toggle picks which fields show.
  const [method, setMethod] = useState<'email' | 'mobile'>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [mobileName, setMobileName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: toE164India(phone),
      options: { shouldCreateUser: true, data: { full_name: mobileName } },
    })

    setLoading(false)
    if (otpError) {
      setError(otpError.message)
      return
    }
    setOtpSent(true)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({ phone: toE164India(phone), token: otp, type: 'sms' })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    window.location.href = '/discover'
  }

  const handleOAuth = async (provider: 'google') => {
    setError('')
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/discover` },
    })
    if (oauthError) setError(oauthError.message)
  }

  return (
    <AuthShell>
      <div className="mb-5">
        <BackButton fallbackHref="/" />
      </div>
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

      {/* email / mobile number -- same account, pick how you want to sign up */}
      <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px] mb-5 w-fit">
        <button
          type="button"
          onClick={() => {
            setMethod('email')
            setOtpSent(false)
          }}
          className={method === 'email' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
          style={{ padding: '6px 18px' }}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod('mobile')}
          className={method === 'mobile' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
          style={{ padding: '6px 18px' }}
        >
          Mobile number
        </button>
      </div>

      {method === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="nm-label">FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="nm-field"
            />
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
      ) : !otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="nm-label">FULL NAME</label>
            <input
              type="text"
              value={mobileName}
              onChange={(e) => setMobileName(e.target.value)}
              placeholder="Your name"
              required
              className="nm-field"
            />
          </div>
          <div>
            <label className="nm-label">MOBILE NUMBER</label>
            {/* India-only for now -- +91 is fixed, not typed, so there's no
                way to pick the wrong country code or omit it by mistake. */}
            <div className="nm-field flex items-center gap-2 !px-0">
              <span className="pl-4 pr-2 text-[#a79ecb] font-bold border-r border-white/10">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(sanitizeIndianMobileInput(e.target.value))}
                placeholder="98765 43210"
                maxLength={10}
                required
                className="flex-1 bg-transparent outline-none pr-4 py-0"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1">
            <input type="checkbox" required className="mt-0.5 accent-[#b968ff]" />
            <span className="text-[11.5px] text-[#a79ecb] font-medium leading-relaxed">
              I agree to the Terms of Service and Host Approval Guidelines
            </span>
          </label>

          <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
            {loading ? 'Sending code…' : 'Send OTP →'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="nm-label !mb-0">ENTER OTP</label>
              <button type="button" onClick={() => setOtpSent(false)} className="text-[12px] font-bold text-[#ff8fd1]">
                Change number
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              required
              className="nm-field"
            />
            <p className="text-[12px] text-muted font-medium mt-2">Code sent to {toE164India(phone)}</p>
          </div>

          <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
            {loading ? 'Verifying…' : 'Verify & create account →'}
          </button>
        </form>
      )}

      <div className="flex items-center gap-2.5 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[11px] font-bold text-[#8a81ab]">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Only Google OAuth for now -- Facebook/Meta and WhatsApp login
          were dropped to avoid Meta Business verification overhead. */}
      <div className="flex gap-3">
        <button type="button" onClick={() => handleOAuth('google')} className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
          Google
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
