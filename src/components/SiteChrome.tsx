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

  if (isAuth) {
    return <>{children}</>
  }

  // Same Header everywhere, marketing site included -- it used to skip
  // rendering here for marketing routes and let a separate Nav
  // component (src/components/marketing-v2/Nav.tsx) stand in instead,
  // which never knew whether you were signed in at all. One header, one
  // source of truth for the menu.
  return (
    <>
      <Header isMarketing={isMarketing} />
      {children}
      <Footer />
    </>
  )
}
