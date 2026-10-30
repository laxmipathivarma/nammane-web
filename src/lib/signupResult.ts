// Supabase's signUp() has one quirk this depends on: when the email given
// already belongs to a confirmed account, it does NOT return an error --
// doing that would let a stranger enumerate which emails have accounts just
// by trying to sign up with them. Instead it returns success (201) with a
// user object whose `identities` array is empty. A genuinely new signup
// always has at least one identity (the email/password one being created).
// This is Supabase's own documented way to tell the two cases apart
// server-side -- see https://supabase.com/docs/reference/javascript/auth-signup
//
// Before this helper existed, the signup API route treated both cases
// identically: it always told the signup page "check your email for a
// code." For a brand-new address that's true. For an address that already
// has an account, Supabase silently sends no email at all (same
// anti-enumeration reasoning), so the person was told to wait for a code
// that was never coming, with no way to tell they'd mistyped their way into
// their own existing account.
export function isExistingAccountSignup(
  user: { identities?: unknown[] | null } | null | undefined
): boolean {
  return Array.isArray(user?.identities) && user!.identities!.length === 0
}
