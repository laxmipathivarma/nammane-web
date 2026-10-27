import type { Metadata } from 'next'
import '@/styles/globals.css'
import IconSprite from '@/components/IconSprite'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'NamMane - Find Your Table',
  description: 'Discover amazing people and great gatherings. Find interesting events or host your own gathering.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap"
        />
      </head>
      <body className="antialiased bg-ink">
        <IconSprite />
        <SiteChrome>
          <main>{children}</main>
        </SiteChrome>
      </body>
    </html>
  )
}
