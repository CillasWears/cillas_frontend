import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary-black flex flex-col">
      {/* Auth Header
      <header className="py-lg border-b border-secondary-grey/20">
        <div className="container-main flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-sm focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent-gold"
            aria-label="Cilla's Wear — Home"
          >
            <Image
              src="/images/logo.svg"
              alt="Cilla's Wear logo"
              width={48}
              height={48}
              style={{ width: '48px', height: '48px' }}
              priority
            />
            <span
              className="font-primary text-primary-white 
                         tracking-wider uppercase"
              style={{ fontSize: '22px' }}
            >
              Cilla's Wear
            </span>
          </Link>
        </div>
      </header> */}

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center py-2xl px-md pt-40">
        {children}
      </main>

      {/* Auth Footer
      <footer className="py-lg border-t border-secondary-grey/20">
        <div className="container-main flex justify-center">
          <p className="text-small text-secondary-grey">
            © {new Date().getFullYear()} Cilla's Wear. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  )
}