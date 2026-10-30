'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/AuthShell'
import BackButton from '@/components/BackButton'
import OtpInput from '@/components/OtpInput'
import { createClient } from '@/lib/supabase'
import { EMAIL_OTP_LENGTH, WHATSAPP_OTP_LENGTH } from '@/lib/otp'
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

// WhatsApp OTP delivery needs a Twilio WhatsApp Sender, which requires
// going through Meta Business verification (and a paid WhatsApp Business
// number) -- the user hit Twilio's paywall for that and asked to hold off
// for now. The sign-in/verify logic below is fully built and tested --
// flip this to true once the Twilio WhatsApp Sender is set up and it
// works immediately, no other changes needed.
const WHATSAPP_LOGIN_ENABLED = false

export default function LoginPage() {
  // Email/password and mobile+OTP are two separate ways in -- same account,
  // same destination after sign-in, just a different first step.
  const [method, setMethod] = useState<'email' | 'mobile'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  // WhatsApp sign-in: a phone number, a code Twilio Verify sends over
  // WhatsApp (via Supabase's own Phone provider, which is already
  // configured with Twilio Verify + the WhatsApp channel), and the 6-digit
  // code the person types back in. A phone number Supabase hasn't seen
  // before is created as a brand-new account automatically -- same as the
  // email OTP flow on the signup page -- so this one screen covers both
  // sign-in and sign-up by WhatsApp.
  const [mobileDigits, setMobileDigits] = useState('')
  const [mobileOtpSent, setMobileOtpSent] = useState(false)
  const [mobileOtp, setMobileOtp] = useState('')
  const [mobileResendStatus, setMobileResendStatus] = useState('')

  // Every sign-in method below used to jump straight to `window.location.href
  // = '/'` the instant Supabase confirmed the sign-in -- on the home screen
  // the only visible difference for a signed-in person is the hero's CTAs
  // disappearing and a small "Quick actions" row appearing further down the
  // page, easy to miss entirely on a phone. With nothing on screen actually
  // saying "you're signed in," a successful sign-in looked identical to a
  // silently failed one, so people kept re-submitting a login that had
  // already worked. This flag swaps the form for an unmistakable "you're in"
  // message for a beat before the redirect actually happens.
  const [justSignedIn, setJustSignedIn] = useState(false)
  const goHomeAfterSignIn = () => {
    setJustSignedIn(true)
    setLoading(false)
    setTimeout(() => {
      window.location.href = '/'
    }, 700)
  }

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

    goHomeAfterSignIn()
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

    goHomeAfterSignIn()
  }

  const handleSendWhatsAppOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileDigits.length !== 10) {
      setError('Enter your 10-digit mobile number.')
      return
    }
    setLoading(true)
    setError('')
    setMobileResendStatus('')

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: toE164India(mobileDigits),
      options: { channel: 'whatsapp' },
    })

    setLoading(false)
    if (otpError) {
      setError(otpError.message)
      return
    }
    setMobileOtpSent(true)
    setMobileResendStatus('Code sent on WhatsApp.')
  }

  const handleResendWhatsAppOtp = async () => {
    setLoading(true)
    setError('')
    setMobileResendStatus('')
    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: toE164India(mobileDigits),
      options: { channel: 'whatsapp' },
    })
    setLoading(false)
    if (otpError) {
      setError(otpError.message)
      return
    }
    setMobileResendStatus('Code sent on WhatsApp.')
  }

  const handleVerifyWhatsAppOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileOtp.length !== WHATSAPP_OTP_LENGTH) {
      setError(`Enter the full ${WHATSAPP_OTP_LENGTH}-digit code.`)
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: toE164India(mobileDigits),
      token: mobileOtp,
      type: 'sms',
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    goHomeAfterSignIn()
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
    <AuthShell blobs={blobs}>
      <div className="flex flex-col items-center text-center">
        <div className="self-start mb-5">
          <BackButton fallbackHref="/" />
        </div>
        {/* Auth pages don't use the shared Header (no nav bar here on
            purpose), so without this the logo was just decorative text --
            nothing on this screen could take you back to the home page
            except the small "Back" link above, which goes to whatever
            page you came from, not home. */}
        {/* Matches the shared Header's logo elsewhere on app.nammane.in:
            goes to the marketing site, not this app's own home. */}
        <a href="https://nammane.in" className="nm-logo-mark w-16 h-16 text-[28px]" style={{ width: 64, height: 64 }}>N</a>

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

        {justSignedIn ? (
          <div className="w-full bg-[#8fe3b0]/10 border border-[#8fe3b0]/40 rounded-2xl px-5 py-8 text-center">
            <p className="text-[14px] font-bold text-[#8fe3b0] mb-1.5">You&apos;re signed in →</p>
            <p className="text-[13px] text-muted font-medium">Taking you home…</p>
          </div>
        ) : method === 'email' && needsEmailVerify ? (
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
                  <OtpInput length={EMAIL_OTP_LENGTH} value={emailOtp} onChange={setEmailOtp} />
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
                  setError('')
                }}
                className={method === 'email' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
                style={{ padding: '6px 18px' }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('mobile')
                  setError('')
                }}
                className={method === 'mobile' ? 'nm-btn nm-btn-gold text-[11.5px]' : 'nm-btn text-[11.5px] font-bold text-muted'}
                style={{ padding: '6px 18px' }}
              >
                WhatsApp
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
        ) : !WHATSAPP_LOGIN_ENABLED ? (
          <div className="w-full bg-ink2 border border-white/10 rounded-2xl px-5 py-6 text-center">
            <p className="text-[14px] font-bold text-white mb-1.5">WhatsApp sign-in isn&apos;t available right now</p>
            <p className="text-[13px] text-muted font-medium leading-relaxed">
              We&apos;re setting it up. For now, please sign in with email or Google instead.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setMethod('email')
                  setError('')
                }}
                className="nm-btn nm-btn-gold flex-1 py-3 text-[13px]"
              >
                Use email
              </button>
              <button type="button" onClick={() => handleOAuth('google')} className="nm-btn nm-btn-ghost flex-1 py-3 text-[13px]">
                Use Google
              </button>
            </div>
          </div>
        ) : !mobileOtpSent ? (
          <form onSubmit={handleSendWhatsAppOtp} className="w-full space-y-4 text-left">
            <div>
              <label className="nm-label">WHATSAPP NUMBER</label>
              <div className="flex items-stretch gap-2">
                <div className="nm-field flex items-center justify-center !w-auto px-3.5 font-bold text-muted">+91</div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobileDigits}
                  onChange={(e) => setMobileDigits(sanitizeIndianMobileInput(e.target.value))}
                  placeholder="10-digit mobile number"
                  required
                  className="nm-field flex-1"
                />
              </div>
              <p className="text-[12px] text-muted font-medium mt-2">
                We&apos;ll send a {WHATSAPP_OTP_LENGTH}-digit code to this number on WhatsApp. New here? This creates your account automatically.
              </p>
            </div>
            <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
              {loading ? 'Sending…' : 'Send WhatsApp code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyWhatsAppOtp} className="w-full space-y-4 text-left">
            <div>
              <label className="nm-label">ENTER CODE</label>
              <OtpInput length={WHATSAPP_OTP_LENGTH} value={mobileOtp} onChange={setMobileOtp} />
              <p className="text-[12px] text-muted font-medium mt-2">
                Code sent to +91 {mobileDigits} on WhatsApp.{' '}
                <button type="button" onClick={handleResendWhatsAppOtp} className="text-[#ff8fd1] font-bold">
                  Resend
                </button>
              </p>
              {mobileResendStatus && <p className="text-[12px] text-[#8fe3b0] font-semibold mt-1">{mobileResendStatus}</p>}
            </div>
            <button type="submit" disabled={loading} className="nm-btn nm-btn-gold w-full py-4 text-[14.5px] disabled:opacity-50">
              {loading ? 'Verifying…' : 'Verify & sign in →'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOtpSent(false)
                setMobileOtp('')
                setError('')
                setMobileResendStatus('')
              }}
              className="nm-btn nm-btn-ghost w-full py-3 text-[13px]"
            >
              Use a different number
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

        {/* Only Google OAuth here -- WhatsApp sign-in is its own tab above
            (OTP-based, not an OAuth provider). Facebook/Meta login was
            dropped to avoid Meta Business verification overhead. */}
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
