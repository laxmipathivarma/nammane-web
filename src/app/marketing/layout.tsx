// The header and footer for marketing routes now come from the root
// layout's shared SiteChrome/Header (same component the web app uses --
// see Header.tsx), not from a marketing-only Nav. This layout now only
// supplies the marketing background.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nm-root min-h-screen text-white" style={{ background: 'var(--nm-base)' }}>
      {children}
    </div>
  )
}
