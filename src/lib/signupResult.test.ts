import { describe, expect, it } from 'vitest'
import { isExistingAccountSignup } from './signupResult'

describe('isExistingAccountSignup', () => {
  it('flags a user with an empty identities array as an existing account', () => {
    expect(isExistingAccountSignup({ identities: [] })).toBe(true)
  })

  it('treats a user with at least one identity as a genuinely new signup', () => {
    // Shape doesn't matter here, only that the array is non-empty.
    expect(isExistingAccountSignup({ identities: [{} as never] })).toBe(false)
  })

  it('does not misfire on null/undefined identities (should never happen, but must not crash)', () => {
    expect(isExistingAccountSignup({ identities: null })).toBe(false)
    expect(isExistingAccountSignup({ identities: undefined })).toBe(false)
  })

  it('does not misfire on a null/undefined user', () => {
    expect(isExistingAccountSignup(null)).toBe(false)
    expect(isExistingAccountSignup(undefined)).toBe(false)
  })
})
