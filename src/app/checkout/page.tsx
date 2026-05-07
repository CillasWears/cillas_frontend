'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe, useCart } from '@/hooks'
import { useCheckoutStore } from '@/store/checkoutStore'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import ShippingStep from '@/components/checkout/ShippingStep'
import PaymentStep from '@/components/checkout/PaymentStep'
import { Skeleton } from '@/components/ui/Skeleton'
import type { CartItem } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useMe()
  const { data: cart, isLoading: isCartLoading } = useCart()
  const { step } = useCheckoutStore()

  // Redirect if not logged in
// With this:
useEffect(() => {
  if (!isUserLoading && !user) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace('/auth/login?callbackUrl=/checkout')
    }
  }
}, [user, isUserLoading, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (!isCartLoading && cart && cart.items.length === 0) {
      router.replace('/shop')
    }
  }, [cart, isCartLoading, router])

  if (isUserLoading || isCartLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-xl">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (!user || !cart) return null

  return (
    <div className="max-w-2xl mx-auto space-y-2xl mt-24 mb-20">
      {/* Progress Indicator */}
      <CheckoutProgress currentStep={step} />

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2xl">
        {/* Main Step */}
        <div className="lg:col-span-3">
      {step === 'shipping' && <ShippingStep />}
      {step === 'payment' && <PaymentStep />}
        </div>

        {/* Order Summary Sidebar */}
        <div
          className="lg:col-span-2 space-y-lg border 
                     border-secondary-grey/20 p-lg h-fit"
        >
          <h3 className="text-h3 text-primary-white font-primary">
            Order Summary
          </h3>

          {/* Cart Items Summary */}
          <div className="space-y-md">
            {cart.items.map((item: CartItem) => {
              const price = parseFloat(String(item.variant?.price ?? item.product.basePrice ?? 0))
              const quantity = parseInt(String(item.quantity ?? 0), 10)
              const itemTotal = (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 0 : quantity)

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-md"
                >
                  <div className="space-y-xs flex-1">
                    <p className="text-small text-primary-white line-clamp-1">
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
                      Qty: {quantity}
                    </p>
                  </div>
                  
                  <p className="text-small text-primary-white flex-shrink-0">
                     ₦{itemTotal.toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div
            className="w-full h-px bg-secondary-grey/20"
            aria-hidden="true"
          />

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <p className="text-body text-secondary-grey">Subtotal</p>
            <p className="text-body text-primary-white">
                ₦{cart.items
                  .reduce((sum: number, item: CartItem) => {
                    const price = parseFloat(String(item.variant?.price ?? item.product.basePrice ?? 0))
                    const quantity = parseInt(String(item.quantity ?? 0), 10)
                    const validPrice = isNaN(price) ? 0 : price
                    const validQuantity = isNaN(quantity) ? 0 : quantity

                    return sum + (validPrice * validQuantity)
                  }, 0)
                  .toLocaleString()}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-body text-secondary-grey">Shipping</p>
            <p className="text-small text-secondary-grey">
              Calculated at next step
            </p>
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between pt-md 
                       border-t border-secondary-grey/20"
          >
            <p className="text-label text-primary-white">Total</p>
            <p className="text-h3 text-primary-white font-primary">
                ₦{cart.items
                  .reduce((sum: number, item: CartItem) => {
                    const price = parseFloat(String(item.variant?.price ?? item.product.basePrice ?? 0))
                    const quantity = parseInt(String(item.quantity ?? 0), 10)
                    const validPrice = isNaN(price) ? 0 : price
                    const validQuantity = isNaN(quantity) ? 0 : quantity

                    return sum + (validPrice * validQuantity)
                  }, 0)
                  .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}