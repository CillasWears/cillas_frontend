'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useAddToCart, useMe } from '@/hooks'
import { parseApiError } from '@/lib/api'
import type { ProductVariant } from '@/types'

interface AddToCartButtonProps {
  productId: string
  selectedVariant: ProductVariant | null
  hasVariants: boolean
}

export default function AddToCartButton({
  productId,
  selectedVariant,
  hasVariants,
}: AddToCartButtonProps) {
  const router = useRouter()
  const { data: user } = useMe()
  const { mutate: addToCart, isPending } = useAddToCart()
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  function handleAddToCart() {
    if (!user) {
      router.push('/auth/login?callbackUrl=' + window.location.pathname)
      return
    }

    if (hasVariants && !selectedVariant) {
      setFeedback({
        type: 'error',
        message: 'Please select a size and color before adding to cart.',
      })
      return
    }

    if (selectedVariant && selectedVariant.inventory === 0) {
      setFeedback({ type: 'error', message: 'This variant is out of stock.' })
      return
    }

    addToCart(
      {
        productId,
        variantId: selectedVariant!.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setFeedback({ type: 'success', message: 'Added to cart!' })
          setTimeout(() => setFeedback(null), 3000)
        },
        onError: (error) => {
          const apiError = parseApiError(error)
          setFeedback({ type: 'error', message: apiError.message })
          setTimeout(() => setFeedback(null), 4000)
        },
      }
    )
  }

  const isOutOfStock =
    hasVariants && selectedVariant?.inventory === 0

  return (
    <div className="space-y-sm">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isPending}
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {isOutOfStock
          ? 'Out of Stock'
          : hasVariants && !selectedVariant
          ? 'Select Options'
          : 'Add to Cart'}
      </Button>

      {/* Feedback Message */}
      {feedback && (
        <p
          role="alert"
          className={
            feedback.type === 'success'
              ? 'text-small text-accent-gold text-center'
              : 'text-small text-red-400 text-center'
          }
        >
          {feedback.message}
        </p>
      )}
    </div>
  )
}