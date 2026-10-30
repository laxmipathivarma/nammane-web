'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import AvatarBadge from '@/components/AvatarBadge'
import OtpInput from '@/components/OtpInput'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthProvider'
import { AVATAR_OPTIONS, AVATAR_GROUP_LABELS, type AvatarGroup } from '@/lib/avatars'
import { INTEREST_OPTIONS, MAX_INTERESTS } from '@/lib/interests'
import { GOVT_ID_TYPES, maskGovtId, type GovtIdType } from '@/lib/govtId'
import { sanitizeIndianMobileInput } from '@/lib/phone'
import { isMinorDob } from '@/lib/age'

type Profile = {
  id: string
  display_name: string | null
  bio: string | null
  city: string | null
  date_of_birth: string | null
  avatar_key: string | null
  interests: string[]
  phone_number: string | null
  phone_verified: boolean
  govt_id_type: GovtIdType | null
  govt_id_number: string | null
  govt_id_verified: boolean
  profile_status: 'active' | 'pending_age_review'
}

const AVATAR_GROUPS: AvatarGroup[] = ['people', 'animals', 'funny', 'heroes']

export default function EditProfilePage() {
  const { user, loading: authLoading, refreshProfile } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Main form fields
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [dob, setDob] = useState('')
  const [avatarKey, setAvatarKey] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [govtIdType, setGovtIdType] = useState<GovtIdType | ''>('')
  const [govtIdNumber, setGovtIdNumber] = useState('')
  const [showGovtId, setShowGovtId] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)

  // Phone / WhatsApp verification
  const [phoneDraft, setPhoneDraft] = useState('')
  const [phoneStep, setPhoneStep] = useState<'idle' | 'sent'>('idle')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneBusy, setPhoneBusy] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [phoneOk, setPhoneOk] = useState(false)

  // Change password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwOk, setPwOk] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/profile')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load your profile')
        const p = j.profile as Profile | null
        if (p) {
          setProfile(p)
          setDisplayName(p.display_name ?? '')
          setBio(p.bio ?? '')
          setCity(p.city ?? '')
          setDob(p.date_of_birth ?? '')
          setAvatarKey(p.avatar_key)
          setInterests(p.interests ?? [])
          setGovtIdType(p.govt_id_type ?? '')
          setGovtIdNumber(p.govt_id_number ?? '')
        }
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  const toggleInterest = (label: string) => {
    setInterests((prev) => {
      if (prev.includes(label)) return prev.filter((i) => i !== label)
      if (prev.length >= MAX_INTERESTS) return prev
      return [...prev, label]
    })
  }

  const addCustomInterest = () => {
    const value = customInterest.trim()
    if (!value || interests.includes(value) || interests.length >= MAX_INTERESTS) return
    setInterests((prev) => [...prev, value])
    setCustomInterest('')
  }

  const dobIsMinor = dob ? isMinorDob(dob) : false

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaveOk(false)

    const body: Record<string, unknown> = {
      display_name: displayName,
      bio,
      city,
      avatar_key: avatarKey,
      interests,
      date_of_birth: dob || null,
    }
    if (govtIdType && govtIdNumber) {
      body.govt_id_type = govtIdType
      body.govt_id_number = govtIdNumber
    } else if (!govtIdType && !govtIdNumber) {
      body.govt_id_type = null
      body.govt_id_number = null
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Could not save your profile')
      setProfile(j.profile)
      setSaveOk(true)
      // The header's account pill reads its avatar from AuthProvider, not
      // from this page's own profile state -- without this it kept
      // showing whatever avatar (or letter fallback) was there when the
      // app first loaded, until a full page reload.
      refreshProfile()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save your profile')
    } finally {
      setSaving(false)
    }
  }

  const sendPhoneCode = async () => {
    setPhoneError('')
    setPhoneOk(false)
    const digits = sanitizeIndianMobileInput(phoneDraft)
    if (digits.length !== 10) {
      setPhoneError('Enter a 10-digit mobile number.')
      return
    }
    setPhoneBusy(true)
    try {
      const res = await fetch('/api/profile/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Could not send the code')
      setPhoneStep('sent')
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : 'Could not send the code')
    } finally {
      setPhoneBusy(false)
    }
  }

  const verifyPhoneCode = async () => {
    setPhoneError('')
    if (phoneOtp.length !== 6) {
      setPhoneError('Enter the 6-digit code.')
      return
    }
    setPhoneBusy(true)
    try {
      const res = await fetch('/api/profile/phone/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: sanitizeIndianMobileInput(phoneDraft), code: phoneOtp }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'That code didn’t work')
      setPhoneOk(true)
      setPhoneStep('idle')
      setPhoneOtp('')
      setPhoneDraft('')
      setProfile((p) => (p ? { ...p, phone_number: j.phone_number ?? p.phone_number, phone_verified: true } : p))
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : 'That code didn’t work')
    } finally {
      setPhoneBusy(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwOk(false)
    if (newPassword.length < 8) {
      setPwError('Use at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords don’t match.')
      return
    }
    setPwBusy(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwBusy(false)
    if (error) {
      setPwError(error.message)
      return
    }
    setPwOk(true)
    setNewPassword('')
    setConfirmPassword('')
  }

  if (authLoading || loading) {
    return (
      <div className="nm-bg min-h-screen text-white flex items-center justify-center">
        <div className="text-muted text-[13px] font-semibold">Loading your profile…</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="nm-bg min-h-screen text-white flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="text-[13px] text-muted2 font-semibold">{loadError}</div>
        <BackButton fallbackHref="/profile" label="Back to profile" />
      </div>
    )
  }

  const currentStatus = profile?.profile_status ?? 'active'

  return (
    <div className="nm-bg min-h-screen text-white pb-20">
      <div className="px-5 pt-8 pb-4 max-w-xl mx-auto">
        <div className="mb-3">
          <BackButton fallbackHref="/profile" />
        </div>
        <h1 className="nm-marquee text-2xl text-gold-text font-extrabold">Edit profile</h1>
        <p className="text-[12.5px] text-muted font-semibold mt-1">
          Update how you show up to hosts and guests.
        </p>
      </div>

      {(currentStatus === 'pending_age_review' || dobIsMinor) && (
        <div className="max-w-xl mx-auto px-5 mb-5">
          <div className="rounded-2xl bg-[#3a1030] border border-[#ff4f9e]/40 px-4 py-3.5 text-[12.5px] font-semibold text-[#ff9ecb]">
            Your profile is held as <strong>pending</strong> because the date of birth on file makes you under 18.
            NamMane is for adults hosting and joining events together, so hosting and joining stay off until this is
            resolved. If this is a mistake, double-check the date of birth below.
          </div>
        </div>
      )}

      {/* Avatar picker */}
      <div className="max-w-xl mx-auto px-5 mb-6">
        <div className="flex flex-col items-center mb-4">
          <AvatarBadge avatarKey={avatarKey} fallbackInitial={(displayName || 'U').charAt(0).toUpperCase()} size={84} />
          <div className="text-[12px] text-muted font-semibold mt-2">Pick an avatar</div>
        </div>
        {AVATAR_GROUPS.map((group) => (
          <div key={group} className="mb-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-muted2 mb-2">
              {AVATAR_GROUP_LABELS[group]}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {AVATAR_OPTIONS.filter((a) => a.group === group).map((a) => {
                const isActive = avatarKey === a.key
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => setAvatarKey(a.key)}
                    aria-label={a.label}
                    title={a.label}
                    className="rounded-full flex items-center justify-center transition-transform"
                    style={{
                      width: 52,
                      height: 52,
                      background: `linear-gradient(160deg,${a.gradient[0]},${a.gradient[1]})`,
                      fontSize: 26,
                      border: isActive ? '3px solid #fff' : '3px solid transparent',
                      boxShadow: isActive ? '0 0 0 3px rgba(255,79,158,.5)' : 'none',
                      transform: isActive ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    {a.emoji}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} className="max-w-xl mx-auto px-5">
        {/* Basic info */}
        <div className="nm-card rounded-2xl p-4 mb-5 space-y-4">
          <div>
            <label className="nm-label">NAME</label>
            <input className="nm-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div>
            <label className="nm-label">BIO</label>
            <textarea
              className="nm-field"
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A line or two about you"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="nm-label">CITY</label>
              <input className="nm-field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" />
            </div>
            <div>
              <label className="nm-label">DATE OF BIRTH</label>
              <input
                type="date"
                className="nm-field"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="nm-card rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <label className="nm-label !mb-0">INTERESTS</label>
            <span className="text-[11px] text-muted2 font-semibold">{interests.length}/{MAX_INTERESTS}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {INTEREST_OPTIONS.map((label) => {
              const isActive = interests.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleInterest(label)}
                  className="nm-chip px-3.5 py-2 text-[12px]"
                  style={
                    isActive
                      ? { background: 'linear-gradient(120deg,#8b3ffb,#ff4f9e)', color: '#fff', border: '1.5px solid #1b0a3d' }
                      : { background: 'rgba(255,255,255,.06)', color: '#e4d4ff' }
                  }
                >
                  {label}
                </button>
              )
            })}
            {interests
              .filter((i) => !(INTEREST_OPTIONS as readonly string[]).includes(i))
              .map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleInterest(label)}
                  className="nm-chip px-3.5 py-2 text-[12px]"
                  style={{ background: 'linear-gradient(120deg,#8b3ffb,#ff4f9e)', color: '#fff', border: '1.5px solid #1b0a3d' }}
                >
                  {label} ✕
                </button>
              ))}
          </div>
          <div className="flex gap-2">
            <input
              className="nm-field flex-1"
              placeholder="Add your own (e.g. Trekking)"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomInterest()
                }
              }}
              disabled={interests.length >= MAX_INTERESTS}
            />
            <button
              type="button"
              onClick={addCustomInterest}
              disabled={interests.length >= MAX_INTERESTS || !customInterest.trim()}
              className="nm-btn bg-ink2 text-white border border-white/10 px-4 text-[12.5px] disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>

        {/* Government ID */}
        <div className="nm-card rounded-2xl p-4 mb-5 space-y-3">
          <label className="nm-label !mb-0">GOVERNMENT ID</label>
          <p className="text-[11.5px] text-muted2 font-medium -mt-1">
            Shown to hosts as a trust signal only — never shared publicly.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="nm-field"
              value={govtIdType}
              onChange={(e) => {
                setGovtIdType(e.target.value as GovtIdType | '')
                setShowGovtId(true)
              }}
            >
              <option value="">Select ID type</option>
              {GOVT_ID_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="relative">
              <input
                className="nm-field pr-10"
                type={showGovtId ? 'text' : 'password'}
                placeholder={GOVT_ID_TYPES.find((t) => t.key === govtIdType)?.placeholder ?? 'ID number'}
                maxLength={GOVT_ID_TYPES.find((t) => t.key === govtIdType)?.maxLength ?? 20}
                value={govtIdNumber}
                onChange={(e) => setGovtIdNumber(e.target.value)}
                disabled={!govtIdType}
              />
              <button
                type="button"
                onClick={() => setShowGovtId((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted2"
              >
                {showGovtId ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {profile?.govt_id_number && !showGovtId && (
            <div className="text-[11.5px] text-muted2 font-semibold">On file: {maskGovtId(profile.govt_id_number)}</div>
          )}
        </div>

        {saveError && (
          <div className="rounded-xl bg-ruby/10 border border-ruby/40 text-[#ff8fd1] px-4 py-3 text-[12.5px] font-semibold mb-4">
            {saveError}
          </div>
        )}
        {saveOk && (
          <div className="rounded-xl bg-[#0f3a2a] border border-[#7fe3a1]/40 text-[#9ff0c0] px-4 py-3 text-[12.5px] font-semibold mb-4">
            Profile saved.
          </div>
        )}

        <button type="submit" disabled={saving} className="nm-btn nm-btn-gold w-full py-3.5 text-[14px] disabled:opacity-50">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      {/* Phone / WhatsApp verification */}
      <div className="max-w-xl mx-auto px-5 mt-7">
        <div className="nm-card rounded-2xl p-4 space-y-3">
          <label className="nm-label !mb-0">MOBILE NUMBER (VERIFY VIA WHATSAPP)</label>
          {profile?.phone_verified && profile.phone_number && (
            <div className="flex items-center gap-2 text-[12.5px] font-bold text-[#9ff0c0]">
              <svg width="15" height="15" viewBox="0 0 24 24" stroke="#7fe3a1" fill="none">
                <use href="#i-check" />
              </svg>
              {profile.phone_number} is verified
            </div>
          )}
          {phoneOk && (
            <div className="text-[12.5px] font-bold text-[#9ff0c0]">Phone number verified.</div>
          )}
          <p className="text-[11.5px] text-muted2 font-medium">
            We send a 6-digit code to this number on WhatsApp. Enter it to verify.
          </p>
          <div className="flex gap-2 items-center">
            <div className="nm-field flex items-center gap-2 !w-auto px-3">
              <span className="text-muted text-[13px] font-bold">+91</span>
            </div>
            <input
              className="nm-field flex-1"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={phoneDraft}
              onChange={(e) => setPhoneDraft(sanitizeIndianMobileInput(e.target.value))}
              disabled={phoneStep === 'sent'}
            />
            {phoneStep === 'idle' && (
              <button
                type="button"
                onClick={sendPhoneCode}
                disabled={phoneBusy || phoneDraft.length !== 10}
                className="nm-btn bg-ink2 text-white border border-white/10 px-4 text-[12.5px] disabled:opacity-40 whitespace-nowrap"
              >
                {phoneBusy ? 'Sending…' : 'Send code'}
              </button>
            )}
          </div>
          {phoneStep === 'sent' && (
            <div className="space-y-2.5">
              <OtpInput length={6} value={phoneOtp} onChange={setPhoneOtp} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={verifyPhoneCode}
                  disabled={phoneBusy || phoneOtp.length !== 6}
                  className="nm-btn nm-btn-gold flex-1 py-2.5 text-[12.5px] disabled:opacity-50"
                >
                  {phoneBusy ? 'Verifying…' : 'Verify'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneStep('idle')
                    setPhoneOtp('')
                  }}
                  className="nm-btn bg-ink2 text-white border border-white/10 px-4 text-[12.5px]"
                >
                  Cancel
                </button>
              </div>
              <button type="button" onClick={sendPhoneCode} className="text-[11.5px] font-bold text-[#ff8fd1]">
                Resend code
              </button>
            </div>
          )}
          {phoneError && <div className="text-[12px] font-semibold text-[#ff8fd1]">{phoneError}</div>}
        </div>
      </div>

      {/* Change password */}
      <div className="max-w-xl mx-auto px-5 mt-5">
        <form onSubmit={handleChangePassword} className="nm-card rounded-2xl p-4 space-y-3">
          <label className="nm-label !mb-0">CHANGE PASSWORD</label>
          <input
            type="password"
            className="nm-field"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="nm-field"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {pwError && <div className="text-[12px] font-semibold text-[#ff8fd1]">{pwError}</div>}
          {pwOk && <div className="text-[12px] font-semibold text-[#9ff0c0]">Password updated.</div>}
          <button type="submit" disabled={pwBusy} className="nm-btn bg-ink2 text-white border border-white/10 w-full py-2.5 text-[12.5px] disabled:opacity-50">
            {pwBusy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
