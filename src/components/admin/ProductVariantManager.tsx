'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAddVariant, useDeleteVariant, useAdminProduct } from '@/hooks'
import { parseApiError } from '@/lib/api'
import { cn } from '@/lib/utils/cn'
import type { ProductVariant } from '@/types'

const variantSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  price: z
    .number({ message: 'Price must be a number' })
    .min(1, 'Price must be greater than 0'),
  inventory: z
    .number({ message: 'Inventory must be a number' })
    .min(0, 'Inventory cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
})

type VariantFormData = z.infer<typeof variantSchema>

interface ProductVariantManagerProps {
  productId: string
  productSlug?: string
  existingVariants?: ProductVariant[]
}

export default function ProductVariantManager({
  productId,
  productSlug,
  existingVariants,
}: ProductVariantManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  )

  // Fetch product data if existingVariants not provided and slug is available
  const { data: product } = useAdminProduct(productSlug || '')
  const variants = existingVariants ?? product?.variants ?? []

  const {
    mutate: addVariant,
    isPending: isAdding,
    error: addError,
  } = useAddVariant()

  const { mutate: deleteVariant, isPending: isDeleting } =
    useDeleteVariant()

  const apiError = addError ? parseApiError(addError) : null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      size: '',
      color: '',
      price: 0,
      inventory: 0,
      sku: '',
    },
  })

  function onSubmit(data: VariantFormData) {
    addVariant(
      { productId, payload: data },
      {
        onSuccess: () => {
          reset()
          setShowForm(false)
          setSuccessMessage('Variant added successfully.')
          setTimeout(() => setSuccessMessage(null), 3000)
        },
      }
    )
  }

  function handleDelete(variantId: string) {
    setDeletingId(variantId)
    deleteVariant(
      { productId, variantId },
      {
        onSettled: () => setDeletingId(null),
      }
    )
  }

  return (
    <div className="space-y-xl">

      {/* Header */}
      <div
        className="flex items-center justify-between gap-md
                   pb-md border-b border-secondary-grey/20"
      >
        <div className="space-y-xs">
          <h3 className="text-h3 text-primary-white font-primary">
            Product Variants
          </h3>
          <p className="text-small text-secondary-grey">
            Add size and color variants with individual pricing 
            and inventory.
          </p>
        </div>
        {!showForm && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <Plus
              size={14}
              strokeWidth={1.5}
              className="mr-sm"
              aria-hidden="true"
            />
            Add Variant
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="border border-accent-gold/40 bg-accent-gold/10 
                     px-md py-sm"
        >
          <p className="text-small text-accent-gold">{successMessage}</p>
        </div>
      )}

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="space-y-md">
          <p className="text-label text-secondary-grey">
            Current Variants ({variants.length})
          </p>

          {/* Variants Table Header */}
          <div
            className="hidden sm:grid grid-cols-5 gap-md px-md 
                       pb-sm border-b border-secondary-grey/20"
          >
            {['Size', 'Color', 'Price', 'Stock', ''].map((header) => (
              <p
                key={header}
                className="text-small text-secondary-grey/60 
                           tracking-wider uppercase"
              >
                {header}
              </p>
            ))}
          </div>

          {/* Variant Rows */}
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={cn(
                'grid grid-cols-2 sm:grid-cols-5 gap-md',
                'p-md border border-secondary-grey/20',
                'transition-opacity duration-150',
                deletingId === variant.id &&
                  'opacity-50 pointer-events-none'
              )}
            >
              <div className="space-y-xs sm:space-y-0">
                <p className="text-small text-secondary-grey sm:hidden">
                  Size
                </p>
                <p className="text-body text-primary-white">
                  {variant.size}
                </p>
              </div>

              <div className="space-y-xs sm:space-y-0">
                <p className="text-small text-secondary-grey sm:hidden">
                  Color
                </p>
                <p className="text-body text-primary-white">
                  {variant.color}
                </p>
              </div>

              <div className="space-y-xs sm:space-y-0">
                <p className="text-small text-secondary-grey sm:hidden">
                  Price
                </p>
                <p className="text-body text-primary-white">
                  ₦{variant.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-xs sm:space-y-0">
                <p className="text-small text-secondary-grey sm:hidden">
                  Stock
                </p>
                <p
                  className={cn(
                    'text-body',
                    variant.inventory === 0
                      ? 'text-red-400'
                      : variant.inventory < 5
                      ? 'text-yellow-400'
                      : 'text-primary-white'
                  )}
                >
                  {variant.inventory === 0
                    ? 'Out of stock'
                    : `${variant.inventory} units`}
                </p>
              </div>

              {/* Delete */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleDelete(variant.id)}
                  disabled={isDeleting}
                  aria-label={`Delete variant ${variant.size} ${variant.color}`}
                  className="text-secondary-grey hover:text-red-400
                             transition-colors duration-150
                             focus-visible:outline-none
                             focus-visible:ring-2
                             focus-visible:ring-accent-gold
                             disabled:opacity-40"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {variants.length === 0 && !showForm && (
        <div
          className="flex flex-col items-center justify-center
                     py-xl border border-dashed border-secondary-grey/20
                     text-center space-y-md"
        >
          <p className="text-body text-secondary-grey">
            No variants added yet.
          </p>
          <p className="text-small text-secondary-grey/60">
            Add variants to specify sizes, colors, pricing, 
            and inventory.
          </p>
        </div>
      )}

      {/* Add Variant Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-lg border border-secondary-grey/20 p-xl"
          noValidate
        >
          <h4 className="text-body text-primary-white font-secondary">
            New Variant
          </h4>

          {apiError && (
            <div
              role="alert"
              className="border border-red-500/40 bg-red-500/10 
                         px-md py-sm"
            >
              <p className="text-small text-red-400">
                {apiError.message}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
            <Input
              label="Size"
              type="text"
              placeholder="e.g. S, M, L, XL"
              required
              error={errors.size?.message}
              {...register('size')}
            />
            <Input
              label="Color"
              type="text"
              placeholder="e.g. Black, Gold, White"
              required
              error={errors.color?.message}
              {...register('color')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            <Input
              label="Price (₦)"
              type="number"
              placeholder="e.g. 25000"
              required
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
            <Input
              label="Inventory"
              type="number"
              placeholder="e.g. 10"
              required
              error={errors.inventory?.message}
              {...register('inventory', { valueAsNumber: true })}
            />
            <Input
              label="SKU"
              type="text"
              placeholder="e.g. ANK-BLK-M"
              required
              error={errors.sku?.message}
              {...register('sku')}
            />
          </div>

          <div className="flex gap-md">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isAdding}
            >
              Add Variant
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                reset()
                setShowForm(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

    </div>
  )
}
