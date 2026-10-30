import { createBrowserClient } from '@supabase/ssr'

// Auth cookies default to a host-only cookie, scoped to whichever
// exact host set them. nammane.in (the marketing site) and
// app.nammane.in (the web app) are the same Next.js deployment
// (middleware.ts rewrites one host onto the other's routes) but two
// different hosts from a cookie's point of view -- so a session set
// while signed in on app.nammane.in was invisible on nammane.in and
// vice versa. Clicking the logo back to nammane.in looked exactly
// like being signed out, and signing in there didn't carry back into
// the app either. Scoping the cookie to the shared parent domain
// (.nammane.in) makes one sign-in valid everywhere under it.
//
// Only done for the real production domain and its subdomains -- a
// browser refuses to set a cookie whose domain isn't the current host
// or one of its parents, so localhost and Vercel preview URLs keep
// the default host-only cookie instead of silently failing to
// persist any session at all.
function cookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const h = window.location.hostname
  return h === 'nammane.in' || h.endsWith('.nammane.in') ? '.nammane.in' : undefined
}

export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookieOptions: { domain: cookieDomain(), sameSite: 'lax' },
  })
