// Weighted profile-completion score shown on the profile page. Each field
// contributes points toward 100 when it's filled in (or, for
// phone/government ID, actually verified) -- someone who fills in
// everything the edit page asks for reaches exactly 100%.
//
// Weights were picked by how much each field matters to trust/matching on
// NamMane: verification (phone/ID) carries the most weight since that's
// what other guests/hosts actually rely on, then the basics that make a
// profile feel like a real person (name, avatar, bio), then nice-to-haves
// (city, DOB, interests).

export type ProfileCompletionInput = {
  display_name?: string | null
  bio?: string | null
  city?: string | null
  date_of_birth?: string | null
  avatar_key?: string | null
  interests?: string[] | null
  phone_verified?: boolean | null
  govt_id_verified?: boolean | null
  govt_id_number?: string | null
}

type Weighted = { key: string; label: string; weight: number; done: boolean }

export function profileCompletionBreakdown(p: ProfileCompletionInput | null | undefined): {
  percent: number
  fields: Weighted[]
} {
  const fields: Weighted[] = [
    { key: 'display_name', label: 'Your name', weight: 15, done: !!p?.display_name?.trim() },
    { key: 'avatar_key', label: 'Profile avatar', weight: 15, done: !!p?.avatar_key },
    { key: 'phone_verified', label: 'Phone verified', weight: 20, done: !!p?.phone_verified },
    { key: 'govt_id', label: 'Government ID on file', weight: 15, done: !!(p?.govt_id_verified || p?.govt_id_number) },
    { key: 'bio', label: 'A short bio', weight: 15, done: !!p?.bio?.trim() },
    { key: 'city', label: 'Your city', weight: 10, done: !!p?.city?.trim() },
    { key: 'date_of_birth', label: 'Date of birth', weight: 5, done: !!p?.date_of_birth },
    { key: 'interests', label: 'A few interests', weight: 5, done: !!(p?.interests && p.interests.length > 0) },
  ]

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0) // 100
  const earned = fields.reduce((sum, f) => sum + (f.done ? f.weight : 0), 0)
  const percent = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0

  return { percent, fields }
}
