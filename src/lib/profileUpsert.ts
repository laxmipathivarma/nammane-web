import type { User } from '@supabase/supabase-js'

// The shape we write to `profiles` on every sign-in, factored out of the
// ensure-profile route so it's plain data-in/data-out and testable without
// spinning up a request or a Supabase client.
export type ProfileUpsertPayload = {
  id: string
  email: string | null
  phone_number: string | null
  phone_verified: boolean
  display_name: string | null
  avatar_url: string | null
}

// Supabase's `user.phone` is '' (not null/undefined) for anyone who signed
// in by email or Google, not phone -- `?? null` only catches null/undefined,
// so an email/Google sign-in used to write phone_number: '' here. profiles
// has a UNIQUE constraint on phone_number, so only the very first such user
// could ever upsert successfully; every other non-phone sign-in hit
// "duplicate key value violates unique constraint" and 500'd (confirmed in
// Vercel's runtime logs -- see the regression test below). `|| null` treats
// '' the same as null/undefined, which is what we actually want: no phone.
export function buildProfileUpsertPayload(user: Pick<User, 'id' | 'email' | 'phone' | 'user_metadata'>): ProfileUpsertPayload {
  return {
    id: user.id,
    email: user.email ?? null,
    phone_number: user.phone || null,
    phone_verified: Boolean(user.phone),
    display_name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  }
}
