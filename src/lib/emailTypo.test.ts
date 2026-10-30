import { describe, expect, it } from 'vitest'
import { suggestEmailCorrection } from './emailTypo'

describe('suggestEmailCorrection', () => {
  it('catches the exact typo that created a dead duplicate account', () => {
    expect(suggestEmailCorrection('laxmipathivarma@gmaill.com')).toBe('laxmipathivarma@gmail.com')
  })

  it('catches other common gmail/yahoo/outlook/hotmail/icloud typos', () => {
    expect(suggestEmailCorrection('someone@gmial.com')).toBe('someone@gmail.com')
    expect(suggestEmailCorrection('someone@yahooo.com')).toBe('someone@yahoo.com')
    expect(suggestEmailCorrection('someone@outlok.com')).toBe('someone@outlook.com')
    expect(suggestEmailCorrection('someone@hotmial.com')).toBe('someone@hotmail.com')
    expect(suggestEmailCorrection('someone@iclod.com')).toBe('someone@icloud.com')
  })

  it('is case-insensitive and trims whitespace', () => {
    expect(suggestEmailCorrection('  Someone@GMAILL.com  ')).toBe('someone@gmail.com')
  })

  it('preserves the local part exactly, only correcting the domain', () => {
    expect(suggestEmailCorrection('first.last+tag@gmaill.com')).toBe('first.last+tag@gmail.com')
  })

  it('returns null for a correctly spelled domain', () => {
    expect(suggestEmailCorrection('someone@gmail.com')).toBeNull()
    expect(suggestEmailCorrection('someone@company.co.in')).toBeNull()
  })

  it('returns null for an unrecognized domain (never invents a correction)', () => {
    expect(suggestEmailCorrection('someone@notaprovider.xyz')).toBeNull()
  })

  it('returns null when there is no "@" yet, or nothing after it', () => {
    expect(suggestEmailCorrection('someone')).toBeNull()
    expect(suggestEmailCorrection('someone@')).toBeNull()
    expect(suggestEmailCorrection('')).toBeNull()
  })
})
