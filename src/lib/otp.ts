// How many digits Supabase actually sends in the "Confirm sign up" email.
// Supabase enforces auth.email.otp_length itself (must be 6-10, no
// dashboard control to go lower) -- this project is configured to send 8.
// If that's ever changed in the Supabase dashboard, update this one number
// and both the signup and login verification screens follow automatically.
export const EMAIL_OTP_LENGTH = 8
