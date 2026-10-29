import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '@/styles/globals.css'
import IconSprite from '@/components/IconSprite'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'NamMane - Find Your Table',
  description: 'Discover amazing people and great gatherings. Find interesting events or host your own gathering.',
  // No favicon.ico ever existed in public/ -- that's why the logo was
  // missing when the site got added to a phone home screen (iOS/Android
  // both read these tags to pick the bookmark icon, and fell back to a
  // blank/generic one with nothing here to find). Full icon set now lives
  // in public/ and public/brand/ (from the brand handoff), wired up below.
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'NamMane — Gather better. Live closer.',
    description: 'Poker faces, full plates, louder karaoke. Real hosts, real nights, zero awkward intros.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NamMane — Gather better. Live closer.',
    description: 'Poker faces, full plates, louder karaoke. Real hosts, real nights, zero awkward intros.',
    images: ['/og-image.png'],
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
