'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useAdminOrder } from '@/hooks'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'
import { Skeleton } from '@/components/ui/Skeleton'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const { data: order, isLoading, error } = useAdminOrder(id)

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
                   py-3xl border border-secondary-grey/20 
                   text-center space-y-lg"
      >
        <p className="text-h3 text-primary-white font-primary">
          Order Not Found
        </p>
        <button
          onClick={() => router.back()}
          className="text-small text-accent-gold hover:text-accent-gold/80
                     transition-colors duration-150"
        >
          Back to Orders
        </button>
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
      <div className="pb-lg border-b border-secondary-grey/20 space-y-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-sm text-small text-secondary-grey
                     hover:text-accent-gold transition-colors duration-150
                     focus-visible:outline-none focus-visible:text-accent-gold"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Back to Orders
        </button>
        <div
          className="flex items-start justify-between gap-md flex-wrap"
        >
          <div className="space-y-xs">
            <h2 className="text-h3 text-primary-white font-primary">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-small text-secondary-grey">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Status Updater */}
      <div className="border border-secondary-grey/20 p-xl">
        <OrderStatusUpdater
          orderId={order.id}
          currentStatus={order.status}
        />
      </div>

      {/* Order Items */}
      <div className="border border-secondary-grey/20 p-xl space-y-lg">
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
        <div className="border border-secondary-grey/20 p-xl space-y-lg">
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

    </div>
  )
}
