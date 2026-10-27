export default function MobileAppPage() {
  return (
    <div className="px-5 py-20 max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(125deg,#8b3ffb,#ff4f9e)' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      </div>
      <h1 className="nm-marquee text-3xl text-white mb-4">Mobile App — coming soon</h1>
      <p className="text-muted text-[15px] font-medium leading-relaxed max-w-md mx-auto mb-8">
        We&apos;re building the NamMane app for iOS and Android. In the meantime, the web app
        works great on your phone&apos;s browser.
      </p>
      <a href="https://app.nammane.in" className="nm-btn nm-btn-gold px-7 py-3.5 text-[14.5px] inline-block">
        Use the Web App →
      </a>
    </div>
  )
}
