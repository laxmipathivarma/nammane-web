// How many digits Supabase actually sends in the "Confirm sign up" email.
// Supabase enforces auth.email.otp_length itself (must be 6-10 -- 6 is the
// shortest it allows, there's no way to go lower). This project is set to
// the minimum, 6. If that's ever changed in the Supabase project config,
// update this one number and both the signup and login verification
// screens follow automatically.
export const EMAIL_OTP_LENGTH = 6

// How many digits the Twilio Verify service sends for phone/WhatsApp
// codes (Verify > Services > this service > General > Code length). Set
// to 6 there to match the email flow. If that's ever changed in the
// Twilio console, update this one number.
export const WHATSAPP_OTP_LENGTH = 6
