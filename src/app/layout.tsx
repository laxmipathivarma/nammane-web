import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Nammane - Social Events Discovery',
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
      <body className="antialiased">
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
