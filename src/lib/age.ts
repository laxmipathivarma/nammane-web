// Age/under-18 handling for profiles.date_of_birth -- see
// profiles.profile_status in database/004_profile_fields.sql. Plain date
// math, no library needed.
export function ageFromDob(dob: string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function isMinorDob(dob: string): boolean {
  if (!dob) return false
  const age = ageFromDob(dob)
  return Number.isFinite(age) && age < 18
}
