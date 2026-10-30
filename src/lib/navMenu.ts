// Single source of truth for the primary nav. The one shared Header
// (src/components/Header.tsx, rendered on both nammane.in and
// app.nammane.in) and Footer.tsx both render this exact list, in this
// exact order and with these exact labels, so no page can ever show a
// different *set* of menu items. Only the destination each label
// resolves to differs -- by host and by sign-in state -- e.g.
// "Discover" is a login gate on the marketing site when signed out,
// and a direct in-app page everywhere else.
export type NavKey = 'home' | 'host' | 'join' | 'discover' | 'webapp' | 'mobile'

export const NAV_LABELS: { key: NavKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'host', label: 'Host' },
  { key: 'join', label: 'Join' },
  { key: 'discover', label: 'Discover' },
  { key: 'webapp', label: 'Web App' },
  { key: 'mobile', label: 'Mobile App' },
]
