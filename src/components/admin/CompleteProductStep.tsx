'use client'

import { useAdminProduct } from '@/hooks'
import ProductVariantManager from './ProductVariantManager'
import ProductImageUpload from './ProductImageUpload'
import { Skeleton } from '@/components/ui/Skeleton'

interface CompleteProductStepProps {
  productId: string
  onDone: () => void
}

export default function CompleteProductStep({
  productId,
  onDone,
}: CompleteProductStepProps) {
  const { data: product, isLoading } = useAdminProduct(productId)

  if (isLoading) {
    return (
      <div className="space-y-lg">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="space-y-3xl">

      {/* Step Header */}
      <div className="space-y-xs">
        <p className="text-label text-accent-gold">Step 2 of 2</p>
        <h3 className="text-h3 text-primary-white font-primary">
          Complete Your Product
        </h3>
        <p className="text-body text-secondary-grey">
          Add variants and images for{' '}
          <span className="text-primary-white">{product.name}</span>
        </p>
      </div>

      {/* Section 1 — Variants */}
      <ProductVariantManager
        productId={product.id}
        productSlug={product.slug}
        existingVariants={product.variants}
      />

      {/* Divider */}
      <div
        className="w-full h-px bg-secondary-grey/20"
        aria-hidden="true"
      />

      {/* Section 2 — Images */}
      <ProductImageUpload
        productId={productId}
        existingImages={product.images}
        onDone={onDone}
      />

    </div>
  )
}
