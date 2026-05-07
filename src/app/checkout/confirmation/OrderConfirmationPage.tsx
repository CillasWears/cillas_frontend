'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, MapPin, Package } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import type { Order } from '@/types'
import { useMe } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import Container from '@/components/layout/Container'

export default function OrderConfirmationPageWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const { data: user, isLoading: isUserLoading } = useMe()
  const {
    data: order,
    isLoading: isOrderLoading,
    error,
  } = useOrder<Order>(orderId)

  useEffect(() => {
    if (!orderId) {
      router.replace('/')
    }
  }, [orderId, router])

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/auth/login')
    }
  }, [user, isUserLoading, router])

  const isLoading = isUserLoading || isOrderLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-black pt-2xl">
        <Container>
          <div className="max-w-2xl mx-auto space-y-2xl py-3xl">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </Container>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-primary-black pt-2xl">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-xl py-3xl">
            <h1 className="text-h2 text-primary-white font-primary">
              Order Not Found
            </h1>
            <p className="text-body text-secondary-grey">
              We couldn't find your order details. Please check your email for confirmation or contact support.
            </p>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum: number, item: any) => {
    const price = parseFloat(String(item.variant?.price ?? item.product.basePrice ?? 0))
    const quantity = parseInt(String(item.quantity ?? 0), 10)
    const validPrice = isNaN(price) ? 0 : price
    const validQuantity = isNaN(quantity) ? 0 : quantity
    
    return sum + (validPrice * validQuantity)
  }, 0)

  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="max-w-2xl mx-auto py-3xl space-y-2xl">
          <div className="text-center space-y-lg">
            <div className="w-20 h-20 rounded-full border-2 border-accent-gold flex items-center justify-center mx-auto" aria-hidden="true">
              <CheckCircle
                size={40}
                strokeWidth={1.5}
                className="text-accent-gold"
              />
            </div>
            <div className="space-y-sm">
              <h1 className="text-h1 text-primary-white font-primary">
                Order Confirmed!
              </h1>
              <p className="text-body text-secondary-grey">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>
            <div className="inline-flex items-center gap-sm px-lg py-sm border border-secondary-grey/20">
              <Package
                size={14}
                strokeWidth={1.5}
                className="text-accent-gold"
                aria-hidden="true"
              />
              <p className="text-small text-secondary-grey">
                Order ID:{' '}
                <span className="text-primary-white font-secondary">
                  {order.id}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-xl py-lg border border-secondary-grey/20">
            <div className="space-y-xs">
              <p className="text-label text-secondary-grey">Order Status</p>
              <p className="text-body text-primary-white">{order.status}</p>
            </div>
            <div className={`px-md py-sm text-small tracking-wider uppercase ${
              order.status === 'PROCESSING'
                ? 'bg-accent-gold/20 text-accent-gold'
                : 'bg-secondary-grey/10 text-secondary-grey'
            }`}>
              {order.status}
            </div>
          </div>

          <div className="border border-secondary-grey/20 p-xl space-y-lg">
            <h2 className="text-h3 text-primary-white font-primary">Order Summary</h2>
            <div className="space-y-lg">
              {order.items.map((item: any) => {
                const price = parseFloat(String(item.variant?.price ?? item.product.basePrice ?? 0))
                const quantity = parseInt(String(item.quantity ?? 0), 10)
                const validPrice = isNaN(price) ? 0 : price
                const validQuantity = isNaN(quantity) ? 0 : quantity
                const itemTotal = validPrice * validQuantity
                
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-md pb-lg border-b border-secondary-grey/20 last:border-0 last:pb-0"
                  >
                    <div className="space-y-xs flex-1">
                      <p className="text-body text-primary-white">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-small text-secondary-grey">
                          {[item.variant.size, item.variant.color]
                            .filter(Boolean)
                            .join(' / ')}
                        </p>
                      )}
                      <p className="text-small text-secondary-grey">Qty: {validQuantity}</p>
                    </div>
                    <p className="text-body text-primary-white flex-shrink-0">
                      ₦{itemTotal.toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="w-full h-px bg-secondary-grey/20" aria-hidden="true" />
            <div className="space-y-sm">
              <div className="flex items-center justify-between">
                <p className="text-body text-secondary-grey">Subtotal</p>
                <p className="text-body text-primary-white">
                  ₦{subtotal.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between pt-sm border-t border-secondary-grey/20">
                <p className="text-label text-primary-white">Total</p>
                <p className="text-h3 text-primary-white font-primary">
                  ₦{subtotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="border border-secondary-grey/20 p-xl space-y-lg">
              <h2 className="text-h3 text-primary-white font-primary">Shipping To</h2>
              <div className="flex items-start gap-md">
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  className="text-accent-gold mt-1 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="space-y-xs">
                  <p className="text-body text-primary-white">{order.shippingAddress.street}</p>
                  <p className="text-small text-secondary-grey">
                    {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border border-secondary-grey/20 p-xl space-y-md">
            <h2 className="text-h3 text-primary-white font-primary">What Happens Next?</h2>
            <div className="space-y-sm">
              {[
                'You will receive an order confirmation email shortly.',
                'Our team will process your order within 1-2 business days.',
                'You will be notified when your order has been shipped.',
                'Estimated delivery: 3-7 business days within Nigeria.',
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-md">
                  <span className="w-6 h-6 rounded-full bg-accent-gold/20 text-accent-gold text-small flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                    {index + 1}
                  </span>
                  <p className="text-body text-secondary-grey">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-lg">
            <Link href={`/account/orders/${order.id}`}>
              <Button variant="primary" size="lg">
                View Order Details
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
