// Fixed starter list for the profile's "what are you into" picker, plus
// room for the person to type in their own. Max 6 is enforced wherever
// this is used (profile edit form + the API route), not here.
export const INTEREST_OPTIONS = [
  'Movies',
  'Long Drives',
  'Poker',
  'Games',
  'Dinner',
  'Drinks',
  'Karaoke',
  'Dancing',
] as const

export const MAX_INTERESTS = 6
