'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'
import BackButton from '@/components/BackButton'
import { createClient } from '@/lib/supabase'
import { toE164India, sanitizeIndianMobileInput } from '@/lib/phone'

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
  // Email/password and mobile+OTP are two separate ways in -- same account,
  // same destination after sign-in, just a different first step.
  const [method, setMethod] = useState<'email' | 'mobile'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Someone who signed up before the signup page had a verification step
  // (or who abandoned it partway through) has an account Supabase will
  // never sign in -- "Email not confirmed" -- and until now there was no
  // way to finish that confirmation from the login screen at all. This
  // catches that specific error and offers the same 6-digit code flow the
  // signup page uses, instead of leaving the person stuck.
  const [needsEmailVerify, setNeedsEmailVerify] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [resendStatus, setResendStatus] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNeedsEmailVerify(false)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      if (signInError.message.toLowerCase().includes('email not confirmed')) {
        setNeedsEmailVerify(true)
        setLoading(false)
        return
      }
      setError(signInError.message)
      setLoading(false)
      return
    }

    window.location.href = '/discover'
  }

  const handleSendEmailVerify = async () => {
    setResendStatus('')
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email })
    setLoading(false)
    if (resendError) {
      setError(resendError.message)
      return
    }
    setResendStatus('Code sent.')
  }

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: emailOtp, type: 'signup' })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    window.location.href = '/discover'
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: toE164India(phone) })

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
    <AuthShell blobs={blobs}>
      <div className="flex flex-col items-center text-center">
        <div className="self-start mb-5">
          <BackButton fallbackHref="/" />
        </div>
        <div className="nm-logo-mark w-16 h-16 text-[28px]" style={{ width: 64, height: 64 }}>N</div>

        <h1 className="nm-marquee text-[27px] text-white mt-6 mb-1.5">
          Welcome{' '}
          <span style={{ background: 'linear-gradient(120deg,#c57bff,#ff6fc2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            back
          </span>
        </h1>
        <p className="text-[13.5px] text-muted font-medium mb-6 max-w-[300px] leading-relaxed">
          Sign in to see your next approved night out.
        </p>

        {error && (
          <div className="w-full bg-ruby/10 border border-ruby/40 text-[#ff8fd1] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold text-left">
            {error}
          </div>
        )}

        {method === 'email' && needsEmailVerify ? (
          <div className="w-full">
            <div className="w-full bg-ruby/10 border border-ruby/40 text-[#ff8fd1] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold text-left">
              This email hasn&apos;t been verified yet. Send a code to finish confirming it.
            </div>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={handleSendEmailVerify}
                disabled={loading}
                className="nm-btn nm-btn-gold flex-1 py-3.5 text-[13px] disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send verification code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNeedsEmailVerify(false)
                  setError('')
                }}
                className="nm-btn nm-btn-ghost py-3.5 text-[13px]"
              >
                Back
              </button>
            </div>
            {resendStatus && (
              <form onSubmit={handleVerifyEmailOtp} className="w-full space-y-4 text-left">
                <div>
                  <label className="nm-label">ENTER CODE</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="6-digit code"
                    required
                    className="nm-field"
                  />
                  <p className="text-[12px] text-muted font-medium mt-2">
                    Code sent to {email}.{' '}
                    <button type="button" onClick={handleSendEmailVerify} className="text-[#ff8fd1] font-bold">
                      Resend
                    </button>
                  </p>
                </div>
                <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
                  {loading ? 'Verifying…' : 'Verify & sign in →'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* email / mobile number -- same account, pick how you want in */}
            <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px] mb-6">
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
          <form onSubmit={handleEmailSubmit} className="w-full space-y-4 text-left">
            <div>
              <label className="nm-label">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="you@email.com"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
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
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="w-full space-y-4 text-left">
            <div>
              <label className="nm-label">MOBILE NUMBER</label>
              {/* India-only for now -- +91 is fixed, not typed, so there's
                  no way to pick the wrong country code or omit it. */}
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

            <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
              {loading ? 'Sending code…' : 'Send OTP →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full space-y-4 text-left">
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
              {loading ? 'Verifying…' : 'Verify & sign in →'}
            </button>
          </form>
        )}
          </>
        )}

        <div className="flex items-center gap-2.5 my-6 w-full">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-bold text-[#8a81ab]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Only Google OAuth for now -- Facebook/Meta and WhatsApp login
            were dropped to avoid Meta Business verification overhead. */}
        <div className="flex gap-3 w-full">
          <button type="button" onClick={() => handleOAuth('google')} className="nm-btn nm-btn-ghost flex-1 py-3.5 text-[13px]">
            Google
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
