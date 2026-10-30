// Catches the exact class of mistake that created a second, dead account
// for a real user: laxmipathivarma@gmail.com (works fine) vs
// laxmipathivarma@gmaill.com (an extra "l" -- typed once at signup,
// Supabase dutifully mailed a confirmation code to that exact misspelled
// address, and of course it never arrived anywhere the person could see
// it). There was nothing wrong with login or with email delivery -- the
// person just had two accounts and didn't know it.
//
// This is deliberately a small, hand-maintained list of common domain
// typos for the handful of providers almost everyone uses, not a general
// spelling corrector -- a false "did you mean" suggestion on a real,
// unusual domain would be worse than no suggestion at all.
const KNOWN_DOMAIN_TYPOS: Record<string, string> = {
  'gmaill.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
}

// Returns a corrected email when the domain exactly matches a known typo,
// or null when there's nothing to suggest (including when the email has
// no "@" yet, or the domain isn't one of the ones above at all --
// deliberately not touching domains we don't recognize).
export function suggestEmailCorrection(email: string): string | null {
  const trimmed = email.trim().toLowerCase()
  const at = trimmed.lastIndexOf('@')
  if (at === -1 || at === trimmed.length - 1) return null

  const domain = trimmed.slice(at + 1)
  const fixedDomain = KNOWN_DOMAIN_TYPOS[domain]
  if (!fixedDomain) return null

  return trimmed.slice(0, at + 1) + fixedDomain
}
