'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'
import AvatarBadge from '@/components/AvatarBadge'
import { useAuth } from '@/lib/AuthProvider'

type ProfileSummary = {
  avatar_key: string | null
  profile_status: 'active' | 'pending_age_review'
  govt_id_verified: boolean
  phone_verified: boolean
}

type Stats = {
  eventsHosted: number
  hostRating: number | null
  reviewCount: number
  repeatGuestPct: number | null
}

type RecentReview = {
  rating: number
  comment: string | null
  reviewerName: string
  reviewerInitial: string
} | null

export default function ProfilePage() {
  const [mode, setMode] = useState<'guest' | 'host'>('host')
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentReview, setRecentReview] = useState<RecentReview>(null)

  // This page previously showed a hardcoded "Laxmipathi Varma" regardless
  // of whether anyone was actually signed in. Send a signed-out visitor to
  // sign in instead of showing them someone else's placeholder profile.
  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/profile')
      .then((r) => r.json())
      .then((j) => {
        setProfile(j.profile ?? null)
        setStats(j.stats ?? null)
        setRecentReview(j.recentReview ?? null)
      })
      .catch(() => {})
  }, [user])

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    user?.phone ||
    ''
  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : '··'

  if (loading || !user) {
    return (
      <div className="nm-bg min-h-screen text-white flex items-center justify-center">
        <div className="text-muted text-[13px] font-semibold">Loading your profile…</div>
      </div>
    )
  }

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="relative px-5 pt-10 pb-14 overflow-hidden text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'conic-gradient(from 180deg at 50% 0%, rgba(178,58,74,.13), rgba(205,168,88,.09), transparent 50%)' }}
        />
        <div className="relative z-10 flex justify-start max-w-md mx-auto mb-2">
          <BackButton fallbackHref="/" />
        </div>
        <div className="nm-marquee relative z-10 text-[15px] text-gold-text">My Profile</div>
      </div>

      <div className="max-w-md mx-auto px-5 -mt-14 flex flex-col items-center relative z-10">
        <div className="rounded-full border-[3px] border-ink" style={{ width: 90, height: 90 }}>
          <AvatarBadge avatarKey={profile?.avatar_key} fallbackInitial={initials} size={84} />
        </div>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="text-[17px] font-extrabold">{displayName}</div>
        </div>
        <div className="text-[11.5px] text-muted font-semibold mt-0.5">{user.email ?? user.phone}</div>

        <Link href="/profile/edit" className="nm-btn nm-btn-gold px-5 py-2 text-[12px] mt-3">
          Edit profile
        </Link>

        <div className="flex bg-ink2 border border-white/10 rounded-full p-[3px] gap-[3px] mt-3.5">
          <button
            onClick={() => setMode('guest')}
            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold ${mode === 'guest' ? 'nm-btn-gold' : 'text-muted'}`}
          >
            Guest
          </button>
          <button
            onClick={() => setMode('host')}
            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold ${mode === 'host' ? 'nm-btn-gold' : 'text-muted'}`}
          >
            Host
          </button>
        </div>
      </div>

      {profile?.profile_status === 'pending_age_review' && (
        <div className="max-w-md mx-auto px-5 mt-5">
          <div className="rounded-2xl bg-[#3a1030] border border-[#ff4f9e]/40 px-4 py-3 text-[12px] font-semibold text-[#ff9ecb]">
            Your profile is pending review because of the date of birth on file. Hosting and joining events stays off
            until this is resolved.
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-5 mt-6 grid grid-cols-3 gap-2.5">
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text">{stats?.eventsHosted ?? 0}</div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">Events hosted</div>
        </div>
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text flex items-center justify-center gap-1">
            {stats?.hostRating != null ? stats.hostRating.toFixed(1) : '—'}
            {stats?.hostRating != null && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <use href="#i-star" />
              </svg>
            )}
          </div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">
            {stats?.hostRating != null ? 'Host rating' : 'No ratings yet'}
          </div>
        </div>
        <div className="nm-card rounded-2xl p-3 text-center">
          <div className="text-[17px] font-extrabold text-gold-text">
            {stats?.repeatGuestPct != null ? `${stats.repeatGuestPct}%` : '—'}
          </div>
          <div className="text-[9.5px] text-muted font-bold mt-0.5">Repeat guests</div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="text-[12px] font-extrabold text-[#e4d4ff] mb-2">Trust &amp; verification</div>
        <div className="nm-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.06]">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#8fe3b0" fill="none">
              <use href="#i-shield" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Government ID</div>
            {profile?.govt_id_verified ? (
              <svg width="16" height="16" viewBox="0 0 24 24">
                <use href="#i-check" />
              </svg>
            ) : (
              <span className="text-[10.5px] font-bold text-muted2">Not verified</span>
            )}
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.06]">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#c9a8ff" fill="none">
              <use href="#i-lock" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Phone number</div>
            {profile?.phone_verified ? (
              <svg width="16" height="16" viewBox="0 0 24 24">
                <use href="#i-check" />
              </svg>
            ) : (
              <span className="text-[10.5px] font-bold text-muted2">Not verified</span>
            )}
          </div>
          <button className="w-full flex items-center gap-3 px-3.5 py-3 text-left">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#ff8fd1" fill="none">
              <use href="#i-flag" />
            </svg>
            <div className="flex-1 text-[12.5px] font-bold">Report or block a user</div>
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="#cfc9e6" fill="none">
              <use href="#i-chev-r" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="text-[12px] font-extrabold text-[#e4d4ff] mb-2">Recent review</div>
        {recentReview ? (
          <div className="nm-card rounded-2xl p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-full bg-[#4cc9f0] text-white text-[10px] font-extrabold flex items-center justify-center" style={{ width: 26, height: 26 }}>
                {recentReview.reviewerInitial}
              </div>
              <div className="text-[12px] font-bold">{recentReview.reviewerName}</div>
              <div className="flex gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={i < recentReview.rating ? '#c9a8ff' : 'rgba(255,255,255,.15)'}
                  >
                    <use href="#i-star" />
                  </svg>
                ))}
              </div>
            </div>
            {recentReview.comment && (
              <p className="text-[12px] text-[#d8d2f0] font-semibold mt-2 leading-relaxed">
                &quot;{recentReview.comment}&quot;
              </p>
            )}
          </div>
        ) : (
          <div className="nm-card rounded-2xl p-3.5 text-center text-[12px] text-muted font-semibold">
            No reviews yet — they&apos;ll show up here once a guest reviews one of your events.
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto px-5 mt-6 pb-16">
        <Link href="/profile/edit" className="w-full flex items-center justify-between text-muted">
          <div className="flex items-center gap-2.5 text-[13px] font-bold">
            <svg width="17" height="17" viewBox="0 0 24 24" stroke="#cfc9e6" fill="none">
              <use href="#i-cog" />
            </svg>
            Privacy &amp; account settings
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="#cfc9e6" fill="none">
            <use href="#i-chev-r" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
