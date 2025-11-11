import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://hunterjohnstone.com'),
  title: {
    default: 'Hunter Johnstone — Software Engineer & Product Consultant',
    template: '%s | Hunter Johnstone',
  },
  description:
    'Senior full-stack engineer helping founders ship performant apps, websites, and SaaS products.',
  keywords: [
    'Hunter Johnstone',
    'software engineer',
    'full-stack developer',
    'SaaS consultant',
    'product engineer',
    'Next.js expert',
  ],
  authors: [{ name: 'Hunter Johnstone' }],
  creator: 'Hunter Johnstone',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Hunter Johnstone — Software Engineer & Product Consultant',
    description:
      'Full-stack consultant crafting fast, resilient products for ambitious teams.',
    url: 'https://hunterjohnstone.come',
    siteName: 'Hunter Johnstone',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hunter Johnstone — Software Engineer & Product Consultant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hunter Johnstone — Software Engineer & Product Consultant',
    description:
      'Full-stack consultant crafting fast, resilient products for ambitious teams.',
    images: ['/twitter-image'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = 'es'

  return (
    <html lang={lang}>
      <body
        className={`${inter.className} bg-[#f5f5f7] text-[#0b0b0f] antialiased`}
        data-lang={lang}
      >
        {children}
      </body>
    </html>
  )
}
