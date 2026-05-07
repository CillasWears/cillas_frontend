'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCartStore } from '@/store/cartStore'
import { useCart } from '@/hooks'

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Stories', href: '/blog' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toggleCart } = useCartStore()
  const { data: cart } = useCart()
  const cartItemCount = cart?.items?.length ?? 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-primary-black border-b border-secondary-grey/20'
            : 'bg-transparent'
        )}
      >
        <nav
          className="container-main flex items-center justify-between py-md"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
            aria-label="Cilla's Wear — Home"
          >
        <Image
         src="/images/logo.svg"
         alt="Cilla's Wear logo"
         width={50}
         height={50}
         priority
         style={{ width: '50px', height: '50px', filter: 'invert(1)', borderRadius: '50%', margin: '10px' }}
       />
            <span className="font-primary text-h3 text-primary-white tracking-wider uppercase">
              Cilla's Wears
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-xl list-none" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-label text-primary-white hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:text-accent-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-lg">
            <Link
              href="/search"
              aria-label="Search"
              className="text-primary-white hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:text-accent-gold"
            >
              <Search size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="text-primary-white hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:text-accent-gold"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button
              onClick={toggleCart}
              aria-label={`Open cart${cartItemCount > 0 ? ` — ${cartItemCount} items` : ''}`}
              className="text-primary-white hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:text-accent-gold relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent-gold 
                             rounded-full flex items-center justify-center
                             text-primary-white"
                  style={{ fontSize: '10px' }}
                  aria-hidden="true"
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-md">
            <button
              onClick={toggleCart}
              aria-label={`Open cart${cartItemCount > 0 ? ` — ${cartItemCount} items` : ''}`}
              className="text-primary-white hover:text-accent-gold transition-colors duration-150 relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent-gold 
                             rounded-full flex items-center justify-center
                             text-primary-white"
                  style={{ fontSize: '10px' }}
                  aria-hidden="true"
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            <button
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-primary-white hover:text-accent-gold transition-colors duration-150"
            >
              {isMobileMenuOpen
                ? <X size={22} strokeWidth={1.5} />
                : <Menu size={22} strokeWidth={1.5} />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-primary-black flex flex-col pt-3xl px-md"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <ul className="flex flex-col gap-xl list-none mt-2xl" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-h2 font-primary text-primary-white hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:text-accent-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-h2 font-primary text-primary-white hover:text-accent-gold transition-colors duration-150"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-h2 font-primary text-primary-white hover:text-accent-gold transition-colors duration-150"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}