import { describe, it, expect } from 'vitest'
import { buildProfileUpsertPayload } from './profileUpsert'

// Regression coverage for the bug that took down every email/Google
// sign-in's ensure-profile call: Supabase's user.phone is '' (not
// null/undefined) for anyone who didn't sign in by phone, and profiles has
// a UNIQUE constraint on phone_number. Writing '' instead of null meant
// only the first non-phone sign-in ever could succeed -- see
// src/app/api/auth/ensure-profile/route.ts for the fix.
describe('buildProfileUpsertPayload', () => {
  it('maps an empty-string phone (email/Google sign-in) to null, not ""', () => {
    const payload = buildProfileUpsertPayload({
      id: 'user-1',
      email: 'person@example.com',
      phone: '',
      user_metadata: {},
    } as any)

    expect(payload.phone_number).toBeNull()
    expect(payload.phone_verified).toBe(false)
  })

  it('keeps a real phone number and marks phone_verified true', () => {
    const payload = buildProfileUpsertPayload({
      id: 'user-2',
      email: null,
      phone: '+919876543210',
      user_metadata: {},
    } as any)

    expect(payload.phone_number).toBe('+919876543210')
    expect(payload.phone_verified).toBe(true)
  })

  it('treats a missing/undefined phone the same as empty string', () => {
    const payload = buildProfileUpsertPayload({
      id: 'user-3',
      email: 'person@example.com',
      phone: undefined as unknown as string,
      user_metadata: {},
    } as any)

    expect(payload.phone_number).toBeNull()
    expect(payload.phone_verified).toBe(false)
  })

  it('prefers full_name over name for display_name, and falls back to null', () => {
    const withFullName = buildProfileUpsertPayload({
      id: 'u', email: null, phone: '',
      user_metadata: { full_name: 'Full Name', name: 'Short Name' },
    } as any)
    expect(withFullName.display_name).toBe('Full Name')

    const withNameOnly = buildProfileUpsertPayload({
      id: 'u', email: null, phone: '',
      user_metadata: { name: 'Short Name' },
    } as any)
    expect(withNameOnly.display_name).toBe('Short Name')

    const withNeither = buildProfileUpsertPayload({
      id: 'u', email: null, phone: '',
      user_metadata: {},
    } as any)
    expect(withNeither.display_name).toBeNull()
  })

  it('never produces two different users with the same empty-string phone_number', () => {
    // This is the actual invariant the UNIQUE constraint cares about: two
    // different users who both signed in without a phone must not collide.
    const a = buildProfileUpsertPayload({ id: 'a', email: 'a@x.com', phone: '', user_metadata: {} } as any)
    const b = buildProfileUpsertPayload({ id: 'b', email: 'b@x.com', phone: '', user_metadata: {} } as any)

    // Both null is fine -- Postgres allows any number of NULLs under a
    // UNIQUE constraint. Both '' would violate it.
    expect(a.phone_number).toBeNull()
    expect(b.phone_number).toBeNull()
  })
})
