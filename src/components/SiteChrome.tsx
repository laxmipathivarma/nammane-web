'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SiteChrome({
  children,
  isMarketing = false,
}: {
  children: React.ReactNode
  isMarketing?: boolean
}) {
  const pathname = usePathname()
  const isAuth = pathname?.startsWith('/auth')

  if (isAuth || isMarketing) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
