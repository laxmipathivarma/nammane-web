'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'
import BackButton from '@/components/BackButton'
import OtpInput from '@/components/OtpInput'
import { createClient } from '@/lib/supabase'
import { EMAIL_OTP_LENGTH } from '@/lib/otp'

export default function SignupPage() {
  // Email/password and mobile+OTP are two separate ways to create the same
  // account -- toggle picks which fields show.
  const [method, setMethod] = useState<'email' | 'mobile'>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Email signup gets its own OTP-step flag -- Supabase's "Confirm email"
  // setting is on for this project, so signUp() never actually creates a
  // session until the 6-digit code from the confirm-signup email is
  // verified. This used to be ignored entirely (the old code redirected to
  // /discover the moment the signup API call succeeded, whether or not a
  // real session existed), which both skipped verification visibly and
  // never told the person a code had been sent.
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [resendStatus, setResendStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Set when the signup API tells us this email already has an account
  // (see isExistingAccountSignup) -- Supabase returns success with no
  // email sent in this case, so without this the person was told "check
  // your inbox for a code" for a code that was never coming.
  const [existingAccountEmail, setExistingAccountEmail] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setExistingAccountEmail('')

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

      const data = await res.json()

      if (data.existingAccount) {
        setExistingAccountEmail(email)
        return
      }

      if (data.session) {
        // Confirm email is off (or this address was already confirmed) --
        // signUp() already returned a live session, so there's nothing to
        // verify.
        window.location.href = '/'
        return
      }

      // No session yet: Supabase is withholding it until the code from the
      // confirmation email is verified.
      setEmailOtpSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (emailOtp.length !== EMAIL_OTP_LENGTH) {
      setError(`Enter the full ${EMAIL_OTP_LENGTH}-digit code.`)
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: emailOtp, type: 'signup' })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    window.location.href = '/'
  }

  const handleResendEmailOtp = async () => {
    setResendStatus('')
    setError('')
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email })
    setResendStatus(resendError ? '' : 'Code resent.')
    if (resendError) setError(resendError.message)
  }

  const handleOAuth = async (provider: 'google') => {
    setError('')
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    })
    if (oauthError) setError(oauthError.message)
  }

  return (
    <AuthShell>
      <div className="mb-5">
        <BackButton fallbackHref="/" />
      </div>
      {/* Auth pages don't use the shared Header, so this is the only
          home link on this screen -- make the whole logo+wordmark
          clickable, same as the header logo everywhere else, and send
          it to the marketing site like every other logo on
          app.nammane.in (not this app's own home). */}
      <a href="https://nammane.in" className="flex items-center gap-3 mb-7">
        <div className="relative inline-flex">
          <div className="nm-logo-mark w-13 h-13 text-[23px]" style={{ width: 52, height: 52 }}>N</div>
        </div>
        <div>
          <div className="nm-head font-extrabold text-[19px]">NamMane</div>
          <div className="text-[11px] font-bold text-[#a79ecb]">Poker · Dinner · Drinks · Karaoke</div>
        </div>
      </a>

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
          onClick={() => setMethod('email')}
          className={method === 'email' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
          style={{ padding: '6px 18px' }}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('mobile')
            setEmailOtpSent(false)
          }}
          className={method === 'mobile' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
          style={{ padding: '6px 18px' }}
        >
          Mobile number
        </button>
      </div>

      {method === 'email' && existingAccountEmail ? (
        <div className="bg-ink2 border border-white/10 rounded-2xl px-5 py-6 text-center">
          <p className="text-[14px] font-bold text-white mb-1.5">You already have an account</p>
          <p className="text-[13px] text-muted font-medium leading-relaxed">
            {existingAccountEmail} is already registered with NamMane -- sign in instead of creating a
            new account.
          </p>
          <Link href="/auth/login" className="nm-btn nm-btn-gold mt-5 py-3 px-6 text-[13px] inline-block">
            Sign in →
          </Link>
        </div>
      ) : method === 'email' && emailOtpSent ? (
        <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="nm-label !mb-0">ENTER CODE</label>
              <button type="button" onClick={() => setEmailOtpSent(false)} className="text-[12px] font-bold text-[#ff8fd1]">
                Change email
              </button>
            </div>
            <OtpInput length={EMAIL_OTP_LENGTH} value={emailOtp} onChange={setEmailOtp} />
            <p className="text-[12px] text-muted font-medium mt-2">
              Code sent to {email}.{' '}
              <button type="button" onClick={handleResendEmailOtp} className="text-[#ff8fd1] font-bold">
                Resend
              </button>
              {resendStatus && <span className="text-[#a79ecb]"> &middot; {resendStatus}</span>}
            </p>
          </div>

          <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
            {loading ? 'Verifying…' : 'Verify & create account →'}
          </button>
        </form>
      ) : method === 'email' ? (
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
      ) : (
        // Mobile sign-up is temporarily unavailable (the OTP provider isn't
        // wired up yet) -- rather than let someone fill in the form and hit
        // a confusing failure, say so up front and point at the two ways
        // that do work right now.
        <div className="bg-ink2 border border-white/10 rounded-2xl px-5 py-6 text-center">
          <p className="text-[14px] font-bold text-white mb-1.5">Mobile sign-up is down right now</p>
          <p className="text-[13px] text-muted font-medium leading-relaxed">
            We&apos;re working on it. For now, please create your account with email or Google instead.
          </p>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className="nm-btn nm-btn-gold mt-5 py-3 px-6 text-[13px]"
          >
            Use email instead →
          </button>
        </div>
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
