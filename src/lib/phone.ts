// The app is India-only for Wave 1, so every phone auth flow (signup
// login, OTP) assumes a 10-digit local number and the +91 country code --
// users never type a country code themselves. This turns whatever digits
// they typed into the E.164 format Supabase/Twilio require (e.g.
// "7036363060" -> "+917036363060"), which is what was missing before:
// the raw 10-digit string was sent straight to Twilio as "+7036363060"
// (just a bare "+" prepended, no country code), which Twilio rejected.
export function toE164India(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '')
  return `+91${digits}`
}

// Keeps the mobile-number input digits-only and capped at 10 characters,
// since the +91 prefix is shown separately and fixed -- no reason to let
// people type spaces, dashes, a leading 0, or a country code into it.
export function sanitizeIndianMobileInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 10)
}
