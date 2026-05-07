'use client'

import Link from 'next/link'
import { Package, ShoppingBag, BookOpen } from 'lucide-react'
import { useAdminProducts } from '@/hooks'
import { useOrders } from '@/hooks'

const quickLinks = [
 {
  label: 'Manage Products',
  href: '/admin/products',
  icon: Package,
  description: 'Add, edit, and remove products from your catalog',
 },
 {
  label: 'Manage Orders',
  href: '/admin/orders',
  icon: ShoppingBag,
  description: 'View and update customer order statuses',
 },
 {
  label: 'Manage Blog',
  href: '/admin/blog',
  icon: BookOpen,
  description: 'Create and publish stories and articles',
 },
]

export default function AdminOverviewPage() {
 const { data: products } = useAdminProducts()
 const { data: orders } = useOrders()

 const stats = [
  {
   label: 'Total Products',
   value: products?.meta.total ?? '—',
  },
  {
   label: 'Total Orders',
   value: orders?.meta.total ?? '—',
  },
 ]

 return (
  <div className="space-y-2xl">

   {/* Stats */}
   <div className="grid grid-cols-2 gap-lg">
    {stats.map((stat) => (
     <div
      key={stat.label}
      className="border border-secondary-grey/20 p-xl space-y-sm"
     >
      <p className="text-small text-secondary-grey">
       {stat.label}
      </p>
      <p className="text-h2 text-primary-white font-primary">
       {stat.value}
      </p>
     </div>
    ))}
   </div>

   {/* Quick Links */}
   <div className="space-y-lg">
    <h2 className="text-h3 text-primary-white font-primary">
     Quick Actions
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
     {quickLinks.map((link) => {
      const Icon = link.icon
      return (
       <Link
        key={link.href}
        href={link.href}
        className="group block p-xl border border-secondary-grey/20
                   hover:border-accent-gold transition-all duration-150
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-accent-gold space-y-md"
       >
        <Icon
         size={24}
         strokeWidth={1.5}
         className="text-accent-gold"
         aria-hidden="true"
        />
        <p
         className="text-body text-primary-white 
                    group-hover:text-accent-gold 
                    transition-colors duration-150"
        >
         {link.label}
        </p>
        <p className="text-small text-secondary-grey">
         {link.description}
        </p>
       </Link>
      )
     })}
    </div>
   </div>

  </div>
 )
}
