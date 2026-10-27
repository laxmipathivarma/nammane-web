import type { Metadata } from 'next'
import { headers } from 'next/headers'
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
  // Set server-side by middleware when a nammane.in/www.nammane.in request
  // got rewritten to /marketing. usePathname() in SiteChrome (a client
  // component) can't see that rewrite -- it still reports the original URL
  // -- so we settle "is this a marketing route" here, on the server, where
  // the rewritten request headers are visible.
  const isMarketing = headers().get('x-nm-marketing') === '1'

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap"
        />
      </head>
      <body className="antialiased bg-ink">
        <IconSprite />
        <SiteChrome isMarketing={isMarketing}>
          <main>{children}</main>
        </SiteChrome>
      </body>
    </html>
  )
}
