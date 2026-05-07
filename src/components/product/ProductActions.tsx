'use client'

import { useState } from 'react'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'
import type { ProductVariant } from '@/types'

interface ProductActionsProps {
  variants: ProductVariant[]
  productId: string
  hasVariants: boolean
}

export default function ProductActions({
  variants,
  productId,
  hasVariants,
}: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null)

  return (
    <div className="space-y-xl">
      <VariantSelector
        variants={variants}
        onVariantChange={setSelectedVariant}
      />
      <AddToCartButton
        productId={productId}
        selectedVariant={selectedVariant}
        hasVariants={hasVariants}
      />
    </div>
  )
}