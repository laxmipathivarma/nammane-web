import MarketingHeader from '@/components/MarketingHeader'
import Footer from '@/components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nm-root nm-bg min-h-screen text-white">
      <MarketingHeader />
      {children}
      <Footer />
    </div>
  )
}
