// India-only government ID types (Wave 1 is India-only -- see
// src/lib/phone.ts) and format validation for each. This is a self-declared
// ID on file for trust purposes, same as the rest of the "Trust &
// verification" section -- NOT checked against any government database.
// See profiles.govt_id_verified in database/004_profile_fields.sql.
export type GovtIdType = 'aadhaar' | 'pan' | 'voter_id' | 'passport'

export const GOVT_ID_TYPES: { key: GovtIdType; label: string; placeholder: string; maxLength: number }[] = [
  { key: 'aadhaar', label: 'Aadhaar', placeholder: '1234 5678 9012', maxLength: 12 },
  { key: 'pan', label: 'PAN Card', placeholder: 'ABCDE1234F', maxLength: 10 },
  { key: 'voter_id', label: 'Voter ID', placeholder: 'ABC1234567', maxLength: 10 },
  { key: 'passport', label: 'Passport No', placeholder: 'A1234567', maxLength: 8 },
]

export function govtIdLabel(type: GovtIdType | string | null | undefined): string {
  return GOVT_ID_TYPES.find((t) => t.key === type)?.label ?? ''
}

// Strips everything but letters/digits and uppercases -- how each type is
// actually stored, so "1234 5678 9012" and "abcde1234f" both normalize the
// same way whether someone pasted them with spaces/lowercase or not.
function normalize(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

const PATTERNS: Record<GovtIdType, RegExp> = {
  // UIDAI Aadhaar numbers never start with 0 or 1.
  aadhaar: /^[2-9]\d{11}$/,
  // 5 letters, 4 digits, 1 letter (the 4th letter denotes holder type --
  // not enforced here, just the general shape).
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  // Election Commission of India EPIC number: 3 letters + 7 digits.
  voter_id: /^[A-Z]{3}[0-9]{7}$/,
  // Indian passport: 1 letter + 7 digits.
  passport: /^[A-Z][0-9]{7}$/,
}

const ERRORS: Record<GovtIdType, string> = {
  aadhaar: 'Enter a valid 12-digit Aadhaar number.',
  pan: 'Enter a valid PAN (format: ABCDE1234F).',
  voter_id: 'Enter a valid Voter ID / EPIC number (format: ABC1234567).',
  passport: 'Enter a valid Indian passport number (format: A1234567).',
}

export function validateGovtId(
  type: GovtIdType,
  raw: string
): { valid: true; value: string } | { valid: false; error: string } {
  const value = normalize(raw)
  if (!PATTERNS[type].test(value)) {
    return { valid: false, error: ERRORS[type] }
  }
  return { valid: true, value }
}

// Masks everything but the last 4 characters, for display -- the number
// itself is still on file and editable, just not shown in full by default.
export function maskGovtId(value: string | null | undefined): string {
  if (!value) return ''
  if (value.length <= 4) return value
  return `${'•'.repeat(value.length - 4)}${value.slice(-4)}`
}
