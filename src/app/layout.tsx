import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '@/styles/globals.css'
import IconSprite from '@/components/IconSprite'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  // Absolute base so the og:image / twitter:image tags below resolve to a
  // full https://nammane.in/... URL -- social apps fetch share-card images
  // from an absolute URL, a relative one won't be picked up.
  metadataBase: new URL('https://nammane.in'),
  title: 'NamMane — Gather better. Live closer.',
  description: 'Poker faces, full plates, louder karaoke. Real hosts, real nights, zero awkward intros.',
  // Full icon set (favicons, PWA icons, apple-touch-icon, the og share
  // card) lives under public/brand/, from the brand handoff -- refreshed
  // with the new sparkle "N" mark and kept all in one place instead of
  // split between public/ and public/brand/.
  icons: {
    icon: [
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/brand/site.webmanifest',
  openGraph: {
    title: 'NamMane — Gather better. Live closer.',
    description: 'Poker faces, full plates, louder karaoke. Real hosts, real nights, zero awkward intros.',
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NamMane — Gather better. Live closer.',
    description: 'Poker faces, full plates, louder karaoke. Real hosts, real nights, zero awkward intros.',
    images: ['/brand/og-image.png'],
  },
}

export const viewport = {
  themeColor: '#8B3FFB',
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
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600;1,700;1,800&display=swap"
        />
        <script src="https://unpkg.com/@phosphor-icons/web@2.1.1" defer></script>
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
