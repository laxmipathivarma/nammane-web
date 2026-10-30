// Phone verification over WhatsApp, via Twilio Verify's REST API directly
// (no twilio npm package -- just two fetch calls, so no new dependency).
//
// Needs three env vars that do NOT exist yet in this project (see
// .env.local.example / .env.production.example -- those only ever had
// TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_PHONE_NUMBER for plain SMS,
// unused, and the login page has said "Mobile sign-in is temporarily
// unavailable -- the OTP provider isn't wired up yet" since before this
// file existed):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_VERIFY_SERVICE_SID   (the Verify Service these calls hit --
//     there is already one set up in the Twilio console for this project;
//     its SID is visible in the console URL as VAb305f1458759ee63d2354f41ea24a36b)
//
// Without those three set (in Vercel's env settings, not committed to
// the repo), every call here throws "not_configured" and the API routes
// that use it return a clear 500 rather than pretending to have sent
// anything. Whether WhatsApp delivery actually works once configured
// depends on the Verify Service's own Channels setting in the Twilio
// console (Verify > Services > this service > Settings) -- WhatsApp has
// to be enabled there; Twilio falls back to SMS for a number it can't
// reach on WhatsApp.
function twilioEnv() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error('not_configured')
  }
  return { accountSid, authToken, verifyServiceSid }
}

function basicAuthHeader(accountSid: string, authToken: string): string {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
}

// Starts a WhatsApp verification -- Twilio sends the code as a WhatsApp
// message to `to` (E.164, e.g. "+917036363060").
export async function startWhatsAppVerification(to: string): Promise<{ status: string }> {
  const { accountSid, authToken, verifyServiceSid } = twilioEnv()

  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
    {
      method: 'POST',
      headers: {
        Authorization: basicAuthHeader(accountSid, authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, Channel: 'whatsapp' }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || 'Could not start WhatsApp verification')
  }
  return { status: data.status }
}

// Checks the code the person typed in against Twilio's record of the
// verification started above. Returns true only when Twilio itself says
// "approved" -- any other status (pending, expired, max attempts, a wrong
// code) is treated as not verified.
export async function checkWhatsAppVerification(to: string, code: string): Promise<boolean> {
  const { accountSid, authToken, verifyServiceSid } = twilioEnv()

  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
    {
      method: 'POST',
      headers: {
        Authorization: basicAuthHeader(accountSid, authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, Code: code }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || 'Could not check verification code')
  }
  return data.status === 'approved'
}
