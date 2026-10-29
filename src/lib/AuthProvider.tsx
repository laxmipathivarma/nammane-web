'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
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

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
      if (data.session?.user) ensureProfile()
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      if (event === 'SIGNED_IN') ensureProfile()
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
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
