import MarketingHero from '@/components/MarketingHero'

export default function MarketingHome() {
  return (
    <>
      <MarketingHero />

      <div className="px-5 pb-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard value="10+" label="Event categories — poker, rummy, drinks, dinner, karaoke & more" />
        <StatCard value="100%" label="Host-approved guests, on every event" />
        <StatCard value="8" label="Major metro cities across India, and growing" />
      </div>

      <div className="px-5 pb-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <NavTile
          icon="i-ticket"
          title="Host an Event"
          description="Set up your night, approve who joins, and keep control of your guest list."
          href="https://app.nammane.in/auth/login"
        />
        <NavTile
          icon="i-check"
          title="Join the Event"
          description="Request to join a night that fits your vibe and get approved by the host."
          href="https://app.nammane.in/auth/login"
        />
        <NavTile
          icon="i-grid"
          title="Discover"
          description="Browse what's happening around you tonight, filtered by category and city."
          href="https://app.nammane.in/auth/login"
        />
      </div>
    </>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="nm-glass rounded-2xl p-6">
      <div className="nm-marquee text-3xl text-white mb-1">{value}</div>
      <div className="text-muted text-[13.5px] font-medium leading-relaxed">{label}</div>
    </div>
  )
}

function NavTile({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <a href={href} className="nm-card rounded-2xl p-6 block hover:-translate-y-0.5 transition-transform">
      <div className="w-10 h-10 rounded-full bg-ink2 border border-gold/30 flex items-center justify-center text-gold-text mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <use href={`#${icon}`} />
        </svg>
      </div>
      <h3 className="nm-marquee text-lg text-white mb-2">{title}</h3>
      <p className="text-muted text-[13.5px] font-medium leading-relaxed">{description}</p>
    </a>
  )
}
