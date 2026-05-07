'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { ProductVariant } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant | null) => void
}

export default function VariantSelector({
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Get unique sizes and colors
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]

  function findVariant(size: string | null, color: string | null) {
    return (
      variants.find((v) => {
        const sizeMatch = sizes.length === 0 || v.size === size
        const colorMatch = colors.length === 0 || v.color === color
        return sizeMatch && colorMatch
      }) || null
    )
  }

  function handleSizeSelect(size: string) {
    const newSize = size === selectedSize ? null : size
    setSelectedSize(newSize)
    onVariantChange(findVariant(newSize, selectedColor))
  }

  function handleColorSelect(color: string) {
    const newColor = color === selectedColor ? null : color
    setSelectedColor(newColor)
    onVariantChange(findVariant(selectedSize, newColor))
  }

  function isOutOfStock(size?: string, color?: string): boolean {
    const variant = variants.find((v) => {
      const sizeMatch = !size || v.size === size
      const colorMatch = !color || v.color === color
      return sizeMatch && colorMatch
    })
    return variant ? variant.inventory === 0 : false
  }

  if (variants.length === 0) return null

  return (
    <div className="space-y-lg">

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-sm">
          <p className="text-label text-primary-white">
            Size
            {selectedSize && (
              <span className="text-accent-gold ml-sm normal-case tracking-normal">
                — {selectedSize}
              </span>
            )}
          </p>
          <div
            className="flex flex-wrap gap-sm"
            role="group"
            aria-label="Select size"
          >
            {sizes.map((size) => {
              const outOfStock = isOutOfStock(size, undefined)
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={outOfStock}
                  aria-pressed={selectedSize === size}
                  aria-label={`Size ${size}${outOfStock ? ' — Out of stock' : ''}`}
                  className={cn(
                    'w-12 h-12 text-small border transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-accent-gold',
                    outOfStock
                      ? 'border-secondary-grey/20 text-secondary-grey/30 cursor-not-allowed line-through'
                      : selectedSize === size
                      ? 'bg-accent-gold border-accent-gold text-primary-white'
                      : 'border-secondary-grey/40 text-primary-white hover:border-accent-gold'
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-sm">
          <p className="text-label text-primary-white">
            Color
            {selectedColor && (
              <span className="text-accent-gold ml-sm normal-case tracking-normal">
                — {selectedColor}
              </span>
            )}
          </p>
          <div
            className="flex flex-wrap gap-sm"
            role="group"
            aria-label="Select color"
          >
            {colors.map((color) => {
              const outOfStock = isOutOfStock(undefined, color)
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={outOfStock}
                  aria-pressed={selectedColor === color}
                  aria-label={`Color ${color}${outOfStock ? ' — Out of stock' : ''}`}
                  className={cn(
                    'px-md py-sm text-small border transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-accent-gold',
                    outOfStock
                      ? 'border-secondary-grey/20 text-secondary-grey/30 cursor-not-allowed line-through'
                      : selectedColor === color
                      ? 'bg-accent-gold border-accent-gold text-primary-white'
                      : 'border-secondary-grey/40 text-primary-white hover:border-accent-gold'
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
