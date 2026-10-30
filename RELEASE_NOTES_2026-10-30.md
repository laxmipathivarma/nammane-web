# NamMane — Release notes, 30 Oct 2026

Covers everything shipped to `app.nammane.in` (`main`) in this session, v1.6.3 → v1.6.8.

## ✅ Shipped and verified live

**Google sign-in actually works now.** Root cause was two bugs stacked on each other:
the session cookie's options (expiry, path) were being dropped on write, and — the real
blocker — the project was on an ancient pre-release of `@supabase/ssr` (0.0.10) that
predated the cookie API your code was written against, so the post-Google-login session
exchange silently failed before it ever reached Supabase. Upgraded to the current
`@supabase/ssr`/`supabase-js`, live-tested end to end (Google → signed in on Discover,
header shows your account, "Sign out" present). v1.6.4–v1.6.6.

**Phone sign-up defaults to +91.** Live on `app.nammane.in`.

**Desktop hero fixed.** The astronaut graphic is now sized to fill the page
(`min(46vw,620px)` vs the old `min(86vw,420px)`) and sits close to the headline
(section gap tightened `gap-10` → `gap-4`). Mobile layout from the earlier PWA/hero
polish work is included too. v1.6.6.

**Public/private events with a discovery radius — the "full build."**
- New `events` columns: `is_public`, `radius_km` (1–100), `lat`, `lng`.
- **Important finding:** `events` had row-level security turned on since the very first
  migration, but *no read/write policies were ever added* — meaning no one could create
  or read a real event through the app at all. That's the actual reason Discover was
  still showing 6 hardcoded demo cards. Added the missing SELECT/INSERT/UPDATE policies.
- Host → Create Event now has a real Public/Private toggle and a radius slider (host's
  current location is captured on publish), and the Publish button actually writes to
  Supabase instead of doing nothing.
- Discover now fetches real published events, asks for your location, and shows public
  events within the host's chosen radius (your own events always show, regardless of
  distance).
- Individual event pages now resolve real events too, not just the 6 demo slugs.

v1.6.7, live.

**Poker as a built-in event type — the lucky-poker port.**
Ported the core of `poker.nammane.in` (your `lucky-poker` repo) into NamMane as a Poker
event module, rather than linking out to the separate app. When you publish a Poker
event you land straight in its ledger:
- Add players, record buy-ins (amount), set cash-outs.
- Shared expenses and rake.
- One-tap settle-up — same minimum-transfer algorithm as lucky-poker (who pays whom,
  fewest payments), stored per-event and host-only.

**Not ported** from the standalone app, to be upfront about scope: multi-table seating,
dealer-bonus splitting, the Google Sheet export, WhatsApp invite-text generation, and its
own email-OTP player accounts (NamMane already has its own auth, so that part doesn't
carry over). What moved is the ledger — the part that actually makes it a *poker event*.

v1.6.8, live.

## 🔴 Needs your input before I can finish it

**Phone OTP is blocked by Twilio, not by our code.** Your Twilio account is still on a
trial plan — error 21608 means the recipient has to be a pre-verified number while on
trial. This needs either (a) adding specific test numbers as verified callers in the
Twilio console, or (b) upgrading the Twilio account to a paid plan to lift the
restriction for everyone. That's a billing decision on your account, so I didn't do it
for you — let me know which way you want to go and I'll wire up whichever path needs code
changes (there shouldn't be any for either option, it's purely a Twilio-side setting).

**Email verification code not arriving — likely but not confirmed.** Custom SMTP is
correctly configured (GoDaddy `smtpout.securerserver.net`, sender `fun@nammane.in`,
rate limit 30 emails/hour — not exhausted). I can't see the SMTP password from here to
verify it's still correct, and I didn't want to create a real account on production to
test end-to-end. Can you either (a) try a signup yourself and tell me if anything lands
in `fun@nammane.in`'s own sent-mail log on GoDaddy, or (b) give me the go-ahead to run
one test signup so I can trace it through Supabase's logs? Either works — I just didn't
want to create a live account without checking first.

## 🟡 Need your help to pin down

**"Post-login footer still shows Sign in/Sign up."** I checked both components: `Footer.tsx`
has no auth-aware text at all (it's just legal links), and `Header.tsx` is correctly
wired to show your account + "Sign out" when signed in — which I confirmed works in my
own live test. So this is likely either a different screen than I'm picturing, or a
stale/cached page load. Next time you see it, a screenshot with the URL visible would
let me pin it down exactly.

**"Google auth not working, directly logging in even for sign in."** This one's hard to
square with my own successful live test moments earlier on the same flow. My best guess,
unconfirmed: the screenshot you sent showed browser chrome that looks like an in-app
browser (WhatsApp/Instagram's built-in browser, not Safari/Chrome directly) — Google
blocks OAuth inside those embedded browsers by design (`disallowed_useragent`), which
would look exactly like "it won't let me sign in." If you tapped the link from inside
another app, try opening app.nammane.in directly in Safari/Chrome instead and let me know
if that's actually what happened.

---
*Versions this session: v1.6.3 → v1.6.8, all on `main`/`app.nammane.in`.*
