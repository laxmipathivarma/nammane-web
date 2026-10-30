'use client'

import Link from 'next/link'
import AuthShell from '@/components/AuthShell'
import BackButton from '@/components/BackButton'

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <div className="self-start mb-7">
          <BackButton fallbackHref="/auth/login" />
        </div>

        {/* Matches the shared Header's logo elsewhere on app.nammane.in:
            goes to the marketing site, not this app's own home. */}
        <a href="https://nammane.in" className="nm-logo-mark w-16 h-16 flex items-center justify-center text-[28px]" style={{ width: 64, height: 64 }}>
          N
        </a>

        <h1 className="nm-marquee text-[27px] text-white mt-6 mb-1.5">Password reset</h1>
        <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-4 text-gold-text">
          COMING SOON
        </div>
        <p className="text-[13.5px] text-muted font-medium mb-7 max-w-[300px] leading-relaxed">
          Our team is still wiring up self-serve password reset. For now, sign in another way or
          reach out and we&apos;ll sort it out by hand.
        </p>

        <Link href="/auth/login" className="nm-btn nm-btn-gold w-full py-4 text-[14.5px]">
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  )
}
