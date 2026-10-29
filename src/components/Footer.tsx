import Link from 'next/link'
import { NAV_LABELS, type NavKey } from '@/lib/navMenu'

// "Explore" mirrors the shared nav menu exactly -- same items, same order,
// same destinations (src/lib/navMenu.ts, also used by Nav.tsx and the app's
// Header.tsx) -- so the footer never lists a different set of links than
// the header does, on either site.
const EXPLORE_HREFS: Record<NavKey, string> = {
  home: '/',
  host: 'https://app.nammane.in/auth/login',
  join: 'https://app.nammane.in/auth/login',
  discover: 'https://app.nammane.in/auth/login',
  webapp: 'https://app.nammane.in',
  mobile: '/mobile-app',
}
const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Explore',
    links: NAV_LABELS.map((item) => ({ label: item.label, href: EXPLORE_HREFS[item.key] })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About NamMane', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '/help' },
      { label: 'Community guidelines', href: '/guidelines' },
      { label: 'Report an issue', href: '/report' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Cookie policy', href: '/cookies' },
    ],
  },
]

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5.1-.7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z' },
  { label: 'X', href: 'https://x.com', icon: 'M4 3h4.2l4 5.6L17 3h3l-6.2 7.9L21 21h-4.2l-4.4-6.1L6.9 21H4l6.7-8.5L4 3Z' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.11V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V21h-4V9Z' },
]

export default function Footer() {
  return (
    <footer className="bg-[#05040400] nm-bg border-t border-white/10 pt-16 pb-8 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12">
          {/* brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="30" height="30" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="ftr-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e4d4ff" />
                    <stop offset=".5" stopColor="#b968ff" />
                    <stop offset="1" stopColor="#6d1fd1" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="58" fill="none" stroke="url(#ftr-gold)" strokeWidth="2.4" />
                <text x="60" y="78" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="58" fill="url(#ftr-gold)">N</text>
              </svg>
              <span className="nm-marquee text-xl text-[#e4d4ff] font-extrabold">NamMane</span>
            </Link>
            <p className="text-muted text-[13.5px] font-medium leading-relaxed max-w-xs mb-5">
              Gather better. Live closer. Community-driven gatherings, hosted by people you trust.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-ink2 border border-white/10 flex items-center justify-center text-muted hover:text-gold-text hover:border-gold/40 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[11.5px] font-extrabold tracking-wide text-[#e4d4ff] uppercase mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-muted text-[13px] font-medium hover:text-gold-text transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* app download row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-7 border-t border-white/10">
          <div>
            <div className="text-[13px] font-bold text-[#e4d4ff] mb-0.5">Get the NamMane app</div>
            <div className="text-[12px] text-muted">Coming soon for Android &amp; iOS — use the web app today.</div>
          </div>
          <div className="flex gap-2.5">
            <div className="nm-btn bg-ink2 text-muted border border-white/10 px-4 py-2.5 text-[12px] opacity-60 cursor-default">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5V3.5c0-.6.3-1 .8-1.3l9.7 9.8-9.7 9.8c-.5-.3-.8-.8-.8-1.3Z"/><path d="M15.3 13.8l-2.3-2.3L4.5 2.9l10.4 6.1 2.6 1.5c.9.5.9 1.8 0 2.3l-2.2 1Z"/></svg>
              App Store · Soon
            </div>
            <div className="nm-btn bg-ink2 text-muted border border-white/10 px-4 py-2.5 text-[12px] opacity-60 cursor-default">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5V3.5c0-.6.3-1 .8-1.3l9.7 9.8-9.7 9.8c-.5-.3-.8-.8-.8-1.3Z"/><path d="M15.3 13.8l-2.3-2.3L4.5 2.9l10.4 6.1 2.6 1.5c.9.5.9 1.8 0 2.3l-2.2 1Z"/></svg>
              Google Play · Soon
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10 text-[12px] text-muted2">
          <div>© {new Date().getFullYear()} NamMane. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-gold-text transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gold-text transition-colors">Privacy</Link>
            <span>Made with ♥ in Bengaluru</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
