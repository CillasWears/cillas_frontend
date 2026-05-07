'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useCreateOrder, useInitializePayment } from '@/hooks'
import { useCheckoutStore } from '@/store/checkoutStore'
import { parseApiError } from '@/lib/api'

export default function PaymentStep() {
  const {
    selectedAddressId,
    setOrderId,
    setPaymentReference,
    setStep,
  } = useCheckoutStore()

  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { mutateAsync: createOrder } = useCreateOrder()
  const { mutateAsync: initializePayment } = useInitializePayment()

  async function handlePayment() {
    if (!selectedAddressId) return
    setError(null)
    setIsProcessing(true)

    try {
      // Step 1 — Create order from cart with selected address
      console.log('Creating order with addressId:', selectedAddressId)
      const order = await createOrder({
        addressId: selectedAddressId,
      })
      console.log('Order created:', order)

      

      setOrderId(order.id)

      // Step 2 — Initialize Paystack payment
      console.log('Initializing payment for orderId:', order.id)
      const payment = await initializePayment({
        orderId: order.id,
      })
      console.log('Payment initialized:', payment)

      setPaymentReference(payment.reference)

      // Step 3 — Redirect to Paystack hosted page
      window.location.href = payment.authorizationUrl

    } catch (err) {
      console.error('Payment error:', err)
      const apiError = parseApiError(err)
      setError(apiError.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-xl">

      {/* Header */}
      <div className="space-y-sm">
        <button
          onClick={() => setStep('shipping')}
          className="flex items-center gap-sm text-small text-secondary-grey
                     hover:text-accent-gold transition-colors duration-150
                     focus-visible:outline-none focus-visible:text-accent-gold"
          aria-label="Back to shipping"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Back to Shipping
        </button>
        <h2 className="text-h2 text-primary-white font-primary">
          Payment
        </h2>
      </div>

      {/* Payment Method */}
      <div
        className="border border-accent-gold p-lg space-y-md"
        role="region"
        aria-label="Payment method"
      >
        <div className="flex items-center gap-md">
          <div
            className="w-5 h-5 rounded-full border-2 border-accent-gold 
                       flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
          </div>
          <div className="flex items-center gap-sm">
            <CreditCard
              size={18}
              strokeWidth={1.5}
              className="text-accent-gold"
              aria-hidden="true"
            />
            <p className="text-body text-primary-white">
              Pay with Paystack
            </p>
          </div>
        </div>
        <p className="text-small text-secondary-grey pl-xl">
          You will be redirected to Paystack's secure payment page to 
          complete your purchase using card, bank transfer, or USSD.
        </p>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-sm">
        <Shield
          size={16}
          strokeWidth={1.5}
          className="text-accent-gold flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-small text-secondary-grey">
          Your payment is secured by Paystack. We never store your 
          card details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 px-md py-md"
        >
          <p className="text-small text-red-400">{error}</p>
        </div>
      )}

      {/* Pay Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isProcessing}
        onClick={handlePayment}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>

    </div>
  )
}