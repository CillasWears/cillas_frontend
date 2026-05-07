'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { useAdminOrders } from '@/hooks'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import Pagination from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminOrdersPage() {
  const { data, isLoading } = useAdminOrders()

  const orders = data?.data ?? []
  const meta = data?.meta

  if (isLoading) {
    return (
      <div className="space-y-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2xl">

      {/* Header */}
      <div className="pb-lg border-b border-secondary-grey/20 space-y-xs">
        <h2 className="text-h3 text-primary-white font-primary">
          Orders
        </h2>
        <p className="text-small text-secondary-grey">
          {meta?.total ?? 0} total orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
                     py-3xl border border-secondary-grey/20 
                     text-center space-y-lg"
        >
          <ShoppingBag
            size={48}
            strokeWidth={1}
            className="text-secondary-grey/40"
            aria-hidden="true"
          />
          <p className="text-h3 text-primary-white font-primary">
            No orders yet
          </p>
          <p className="text-body text-secondary-grey">
            Orders will appear here once customers start purchasing.
          </p>
        </div>
      ) : (
        <div className="space-y-md">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className={cn(
                'flex items-center justify-between gap-md',
                'p-lg border border-secondary-grey/20',
                'hover:border-accent-gold transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-accent-gold group'
              )}
              aria-label={`Order ${order.id} — ${order.status}`}
            >
              <div className="space-y-sm flex-1 min-w-0">
                <div className="flex items-center gap-md flex-wrap">
                  <p className="text-small text-secondary-grey">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-body text-primary-white">
                  ₦{order.totalAmount.toLocaleString()}
                </p>
                <p className="text-small text-secondary-grey">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                className="text-secondary-grey group-hover:text-accent-gold
                           transition-colors duration-150 flex-shrink-0"
                aria-hidden="true"
              />
            </Link>
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
            />
          )}
        </div>
      )}

    </div>
  )
}
