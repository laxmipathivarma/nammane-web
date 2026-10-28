import Nav from '@/components/marketing-v2/Nav'
import Footer from '@/components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nm-root min-h-screen text-white" style={{ background: 'var(--nm-base)' }}>
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
