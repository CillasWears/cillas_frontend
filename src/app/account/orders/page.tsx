'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import Pagination from '@/components/ui/Pagination'
import Badge from '@/components/ui/Badge'
import { ChevronRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { OrderStatus } from '@/types'

function getStatusVariant(
  status: OrderStatus
): 'gold' | 'default' | 'outline' {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return 'gold'
    case 'PROCESSING':
    case 'SHIPPED':
      return 'outline'
    default:
      return 'default'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, status, error } = useOrders()

  const orders = data?.data ?? []
  const meta = data?.meta

  // Show loading skeleton while:
  // 1. The query is actively loading (isLoading)
  // 2. The query is pending (not yet enabled — waiting for client/token check)
  if (isLoading || status === 'pending') {
    return (
      <div className="space-y-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-secondary-grey/10 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2xl">
        <div className="space-y-sm pb-lg border-b border-secondary-grey/20">
          <h2 className="text-h3 text-primary-white font-primary">
            Order History
          </h2>
        </div>
        <div
          className="flex flex-col items-center justify-center 
                     py-3xl space-y-lg border border-red-500/20
                     text-center"
        >
          <Package
            size={48}
            strokeWidth={1}
            className="text-red-400/40"
            aria-hidden="true"
          />
          <p className="text-h3 text-primary-white font-primary">
            Error Loading Orders
          </p>
          <p className="text-body text-secondary-grey">
            {error instanceof Error ? error.message : 'Failed to load orders'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2xl">

      {/* Section Header */}
      <div className="space-y-sm pb-lg border-b border-secondary-grey/20">
        <h2 className="text-h3 text-primary-white font-primary">
          Order History
        </h2>
        <p className="text-body text-secondary-grey">
          {meta?.total
            ? `${meta.total} order${meta.total > 1 ? 's' : ''}`
            : 'No orders yet'}
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div
          className="flex flex-col items-center justify-center 
                     py-3xl space-y-lg border border-secondary-grey/20
                     text-center"
        >
          <Package
            size={48}
            strokeWidth={1}
            className="text-secondary-grey/40"
            aria-hidden="true"
          />
          <p className="text-h3 text-primary-white font-primary">
            No orders yet
          </p>
          <p className="text-body text-secondary-grey">
            When you place an order it will appear here.
          </p>
          <Link
            href="/shop"
            className="text-small text-accent-gold 
                       hover:text-accent-gold/80 transition-colors 
                       duration-150"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-md">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
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
                    <p className="text-small text-secondary-grey font-secondary truncate">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <Badge
                      label={order.status}
                      variant={getStatusVariant(order.status)}
                    />
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
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
            />
          )}
        </>
      )}
    </div>
  )
}
