'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, MapPin, LogOut } from 'lucide-react'
import { useLogout } from '../../hooks/useAuth'
import { cn } from '../../lib/utils/cn'

const navItems = [
  {
    label: 'Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    label: 'Orders',
    href: '/account/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
]

export default function AccountSidebar() {
  const pathname = usePathname()
  const { mutate: logout, isPending } = useLogout()

  return (
    <aside
      className="w-full lg:w-64 flex-shrink-0"
      aria-label="Account navigation"
    >
      <nav>
        <ul className="flex flex-row lg:flex-col gap-sm" role="list">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                            pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-md px-lg py-md',
                    'text-small tracking-wider uppercase',
                    'border transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-accent-gold',
                    isActive
                      ? 'border-accent-gold text-accent-gold'
                      : 'border-transparent text-secondary-grey hover:text-primary-white hover:border-secondary-grey/40'
                  )}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              </li>
            )
          })}

          {/* Logout */}
          <li className="lg:mt-xl">
            <button
              onClick={() => logout()}
              disabled={isPending}
              className={cn(
                'flex items-center gap-md px-lg py-md w-full',
                'text-small tracking-wider uppercase',
                'border border-transparent transition-all duration-150',
                'text-secondary-grey hover:text-red-400',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-accent-gold',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              <LogOut
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="hidden sm:block">
                {isPending ? 'Signing out...' : 'Sign Out'}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}