'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  avatarKey: string | null
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  avatarKey: null,
  refreshProfile: async () => {},
  signOut: async () => {},
})

// Whenever a session appears (fresh sign-in, OAuth redirect, OTP verify, or
// just the browser restoring a saved session on page load), make sure a row
// exists for this person in `profiles`. This is the one place that runs for
// every auth method (email, phone, Google) instead of duplicating
// the upsert in each login/signup form.
async function ensureProfile() {
  try {
    await fetch('/api/auth/ensure-profile', { method: 'POST' })
  } catch {
    // best-effort -- a failed profile upsert shouldn't block sign-in
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarKey, setAvatarKey] = useState<string | null>(null)

  // The picked avatar (src/lib/avatars.ts) for whoever's signed in, shared
  // app-wide -- the header's account pill used to always show a plain
  // letter badge because it never looked past the auth user object, which
  // has no notion of avatar_key at all (that only lives in `profiles`).
  // Exposed as refreshProfile() so the edit page can call it right after a
  // successful save and have the header pick up a new avatar immediately,
  // instead of only updating on the next full page load.
  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) return
      const j = await res.json()
      setAvatarKey(j.profile?.avatar_key ?? null)
    } catch {
      // best-effort -- the avatar badge just keeps showing its fallback initial
    }
  }, [])

  // Deliberately a separate effect from the auth listener below, keyed off
  // user?.id rather than folded into that onAuthStateChange callback --
  // see its own comment on why that one chain has to stay the single
  // source of truth for session state with nothing else racing into it.
  useEffect(() => {
    if (user) {
      refreshProfile()
    } else {
      setAvatarKey(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, refreshProfile])

  useEffect(() => {
    const supabase = createClient()

    // This used to ALSO call supabase.auth.getSession() here, separately
    // from the onAuthStateChange subscription below -- two independent
    // async chains racing to call setUser/setSession. That's how a real
    // bug happened: a stale session left over from hours earlier (expired
    // access token, and its refresh token already invalid/rotated) made
    // getSession() kick off a background refresh that fails every time.
    // If that failed-refresh cleanup resolved *after* a brand new,
    // genuinely successful sign-in had already set a valid session, it
    // would wipe the fresh session straight back out -- login would
    // succeed (a real 200 from Supabase) and the cookie would still get
    // cleared, leaving the header stuck on "Sign in / Sign up" with no
    // error anywhere. onAuthStateChange alone delivers every event --
    // including the current state as an initial event the moment you
    // subscribe -- strictly in order, so there's only ever one chain
    // updating state and the most recent event always wins.
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession?.user)) ensureProfile()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    window.location.href = '/'
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, avatarKey, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
