import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { X } from 'lucide-react'
import Container from './Container'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
  ],
  company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: X,
  },
]

export default function Footer() {
  return (
    <footer
      className="bg-primary-black border-t border-secondary-grey/20 
                 mt-3xl"
      aria-label="Site footer"
    >
      <Container>

        {/* Top Section */}
        <div className="py-2xl grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-5 gap-2xl">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-lg">
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
              />
              <span
                className="font-primary text-primary-white 
                           tracking-wider uppercase"
                style={{ fontSize: '22px' }}
              >
                Cilla's Wears
              </span>
            </Link>
            <p className="text-body text-secondary-grey max-w-xs">
              Premium urban-African fashion. Bold, minimal, and deeply 
              cultural clothing crafted for the modern African.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-lg">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-secondary-grey hover:text-accent-gold 
                               transition-colors duration-150 
                               focus-visible:outline-none 
                               focus-visible:text-accent-gold"
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-lg">
            <h3 className="text-label text-primary-white">Shop</h3>
            <ul className="space-y-md list-none" role="list">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-secondary-grey 
                               hover:text-accent-gold transition-colors 
                               duration-150 focus-visible:outline-none
                               focus-visible:text-accent-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-lg">
            <h3 className="text-label text-primary-white">Company</h3>
            <ul className="space-y-md list-none" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-secondary-grey 
                               hover:text-accent-gold transition-colors 
                               duration-150 focus-visible:outline-none
                               focus-visible:text-accent-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-lg">
            <h3 className="text-label text-primary-white">Support</h3>
            <ul className="space-y-md list-none" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-secondary-grey 
                               hover:text-accent-gold transition-colors 
                               duration-150 focus-visible:outline-none
                               focus-visible:text-accent-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className="py-lg border-t border-secondary-grey/20 
                     flex flex-col md:flex-row items-center 
                     justify-between gap-md"
        >
          <p className="text-small text-secondary-grey">
            © {new Date().getFullYear()} Cilla's Wear. 
            All rights reserved.
          </p>
          <div className="flex items-center gap-lg">
            <Link
              href="/privacy"
              className="text-small text-secondary-grey hover:text-accent-gold 
                         transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-small text-secondary-grey hover:text-accent-gold 
                         transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </Container>
    </footer>
  )
}