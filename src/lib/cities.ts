// Canonical list of the "8 major metro cities" the marketing site already
// advertises (the Explore section's stat tile: "8 · Major metro cities
// across India, and growing") -- kept in one place so Discover's city
// filter and the host-side city picker all draw from the same list
// instead of drifting out of sync with each other or with that claim.
export const METRO_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
] as const

export type MetroCity = (typeof METRO_CITIES)[number]
