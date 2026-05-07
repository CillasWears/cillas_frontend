'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useVerifyPayment } from '@/hooks'
import { useCheckoutStore } from '@/store/checkoutStore'
import { Skeleton } from '@/components/ui/Skeleton'
import { parseApiError } from '@/lib/api'

// Main component wrapped with Suspense
export default function PaystackCallbackPage() {
  return (
    <Suspense fallback={<PaymentVerificationSkeleton />}>
      <CallbackContent />
    </Suspense>
  )
}

// Separate component that uses useSearchParams
function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || 
                    searchParams.get('trxref') || ''

  const { orderId, reset } = useCheckoutStore()
  const { mutate: verifyPayment } = useVerifyPayment()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) {
      router.replace('/checkout')
      return
    }

    verifyPayment(
      { reference },
      {
        onSuccess: (data) => {
          if (data.success) {
            reset()
            router.replace(
              `/checkout/confirmation?orderId=${data.orderId}`
            )
          } else {
            setError('Payment verification failed. Please contact support.')
          }
        },
        onError: (err) => {
          const apiError = parseApiError(err)
          setError(apiError.message)
        },
      }
    )
  }, [reference, verifyPayment, reset, router])

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center space-y-xl py-3xl">
        <h1 className="text-h2 text-primary-white font-primary">
          Payment Failed
        </h1>
        <p className="text-body text-secondary-grey">{error}</p>
        <button
          onClick={() => router.replace('/checkout')}
          className="text-small text-accent-gold hover:text-accent-gold/80
                     transition-colors duration-150"
        >
          Return to Checkout
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-xl py-3xl">
      <div className="space-y-lg">
        <div
          className="w-16 h-16 rounded-full border-2 border-accent-gold
                     flex items-center justify-center mx-auto animate-pulse"
          aria-hidden="true"
        >
          <span className="text-accent-gold text-h3">₦</span>
        </div>
        <h1 className="text-h2 text-primary-white font-primary">
          Verifying Payment
        </h1>
        <p className="text-body text-secondary-grey">
          Please wait while we confirm your payment...
        </p>
      </div>
      <div className="space-y-md">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
    </div>
  )
}

// Loading skeleton component
function PaymentVerificationSkeleton() {
  return (
    <div className="max-w-md mx-auto text-center space-y-xl py-3xl">
      <div className="space-y-lg">
        <div
          className="w-16 h-16 rounded-full border-2 border-accent-gold
                     flex items-center justify-center mx-auto animate-pulse"
          aria-hidden="true"
        >
          <span className="text-accent-gold text-h3">₦</span>
        </div>
        <h1 className="text-h2 text-primary-white font-primary">
          Loading...
        </h1>
        <p className="text-body text-secondary-grey">
          Preparing payment verification
        </p>
      </div>
      <div className="space-y-md">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
    </div>
  )
}