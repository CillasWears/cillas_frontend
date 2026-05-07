import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import QueryProvider from '@/components/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Cilla's Wears — Premium Urban-African Fashion",
    template: "%s | Cilla's Wears",
  },
  description:
    "Discover premium urban-African fashion at Cilla's Wears. Bold, minimal, and deeply cultural clothing crafted for the modern African.",
  keywords: [
    'African fashion',
    'urban African clothing',
    'premium fashion Nigeria',
    'African designer wear',
    'contemporary African fashion',
  ],
  authors: [{ name: "Cilla's Wear" }],
  creator: "Cilla's Wear",
  openGraph: {
    siteName: "Cilla's Wear",
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@cillaswear',
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
  return (
    <html lang="en">
      <body className="bg-primary-black text-primary-white font-secondary antialiased">
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </QueryProvider>
      </body>
    </html>
  )
}
