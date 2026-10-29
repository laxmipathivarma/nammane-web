// Single source of truth for the primary nav. Both the marketing site's Nav
// (src/components/marketing-v2/Nav.tsx, and its Footer.tsx mirror) and the
// web app's Header (src/components/Header.tsx) render this exact list, in
// this exact order and with these exact labels, so the two sites can never
// show a different *set* of menu items again. Only the destination each
// label resolves to differs per site -- e.g. "Discover" is a login gate on
// the logged-out marketing site, and a direct in-app page inside the app.
export type NavKey = 'home' | 'host' | 'join' | 'discover' | 'webapp' | 'mobile'

export const NAV_LABELS: { key: NavKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'host', label: 'Host' },
  { key: 'join', label: 'Join' },
  { key: 'discover', label: 'Discover' },
  { key: 'webapp', label: 'Web App' },
  { key: 'mobile', label: 'Mobile App' },
]
