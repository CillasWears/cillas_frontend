'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'
import { ArrowLeft, MapPin, Package } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import Badge from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
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
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: order, isLoading, error } = useOrder(id)
  

  if (isLoading) {
    return (
      <div className="space-y-xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
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
          Order Not Found
        </p>
        <Link
          href="/account/orders"
          className="text-small text-accent-gold hover:text-accent-gold/80
                     transition-colors duration-150"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="space-y-2xl">

      {/* Header */}
      <div className="space-y-sm pb-lg border-b border-secondary-grey/20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-sm text-small text-secondary-grey
                     hover:text-accent-gold transition-colors duration-150
                     focus-visible:outline-none focus-visible:text-accent-gold
                     mb-md"
          aria-label="Back to orders"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Back to Orders
        </button>
        <div className="flex items-start justify-between gap-md flex-wrap">
          <div className="space-y-xs">
            <h2 className="text-h3 text-primary-white font-primary">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-small text-secondary-grey">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge
            label={order.status}
            variant={getStatusVariant(order.status)}
          />
        </div>
      </div>

      {/* Order Items */}
      <div
        className="border border-secondary-grey/20 p-xl space-y-lg"
      >
        <h3 className="text-label text-primary-white">Items Ordered</h3>
        <div className="space-y-lg">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-md
                         pb-lg border-b border-secondary-grey/20
                         last:border-0 last:pb-0"
            >
              <div className="space-y-xs flex-1">
                <p className="text-body text-primary-white">
                  {item.product.name}
                </p>
                {item.variant && (
                  <p className="text-small text-secondary-grey">
                    {[item.variant.size, item.variant.color]
                      .filter(Boolean)
                      .join(' / ')}
                  </p>
                )}
                <p className="text-small text-secondary-grey">
                  Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                </p>
              </div>
              <p className="text-body text-primary-white flex-shrink-0">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          className="space-y-sm pt-lg border-t border-secondary-grey/20"
        >
          <div className="flex items-center justify-between">
            <p className="text-body text-secondary-grey">Subtotal</p>
            <p className="text-body text-primary-white">
              ₦{subtotal.toLocaleString()}
            </p>
          </div>
          <div
            className="flex items-center justify-between pt-sm 
                       border-t border-secondary-grey/20"
          >
            <p className="text-label text-primary-white">Total</p>
            <p className="text-h3 text-primary-white font-primary">
              ₦{order.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div
          className="border border-secondary-grey/20 p-xl space-y-lg"
        >
          <h3 className="text-label text-primary-white">
            Shipping Address
          </h3>
          <div className="flex items-start gap-md">
            <MapPin
              size={16}
              strokeWidth={1.5}
              className="text-accent-gold mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-xs">
              <p className="text-body text-primary-white">
                {order.shippingAddress.street}
              </p>
              <p className="text-small text-secondary-grey">
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.state},{' '}
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Timeline */}
      <div
        className="border border-secondary-grey/20 p-xl space-y-lg"
      >
        <h3 className="text-label text-primary-white">Order Status</h3>
        <div className="space-y-md">
          {[
            'PENDING',
            'PAID',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
          ].map((status, index) => {
            const statuses = [
              'PENDING',
              'PAID',
              'PROCESSING',
              'SHIPPED',
              'DELIVERED',
            ]
            const currentIndex = statuses.indexOf(order.status)
            const isCompleted = index <= currentIndex
            const isCurrent = status === order.status

            return (
              <div
                key={status}
                className="flex items-center gap-md"
              >
                <div
                  className={cn(
                    'w-3 h-3 rounded-full flex-shrink-0',
                    isCompleted
                      ? 'bg-accent-gold'
                      : 'bg-secondary-grey/20'
                  )}
                  aria-hidden="true"
                />
                <p
                  className={cn(
                    'text-small',
                    isCurrent
                      ? 'text-accent-gold'
                      : isCompleted
                      ? 'text-primary-white'
                      : 'text-secondary-grey/40'
                  )}
                >
                  {status}
                  {isCurrent && (
                    <span className="ml-sm text-secondary-grey">
                      — Current
                    </span>
                  )}
                </p>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
