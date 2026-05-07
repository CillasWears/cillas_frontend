'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks'
import { cn } from '../../lib/utils/cn'
import type { CartItem as CartItemType } from '../../types/cart'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem()

  const isPending = isUpdating || isRemoving
  const itemPrice = item.variant?.price ?? item.product.basePrice
  const totalPrice = itemPrice * item.quantity

  function handleIncrease() {
    updateItem({
      itemId: item.id,
      payload: { quantity: item.quantity + 1 },
    })
  }

  function handleDecrease() {
    if (item.quantity === 1) {
      removeItem(item.id)
    } else {
      updateItem({
        itemId: item.id,
        payload: { quantity: item.quantity - 1 },
      })
    }
  }

  function handleRemove() {
    removeItem(item.id)
  }

  return (
    <div
      className={cn(
        'flex gap-md py-lg border-b border-secondary-grey/20',
        'transition-opacity duration-150',
        isPending && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Product Image */}
      <div
        className="relative w-20 h-24 flex-shrink-0 
                   bg-secondary-grey/10 overflow-hidden"
      >
        <div
          className="w-full h-full bg-secondary-grey/10 
                     flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-small text-secondary-grey/40">
            IMG
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-sm">

        {/* Name + Remove */}
        <div className="flex items-start justify-between gap-sm">
          <h3 className="text-body text-primary-white line-clamp-2">
            {item.product.name}
          </h3>
          <button
            onClick={handleRemove}
            aria-label={`Remove ${item.product.name} from cart`}
            disabled={isPending}
            className="text-secondary-grey hover:text-accent-gold 
                       transition-colors duration-150 flex-shrink-0
                       focus-visible:outline-none focus-visible:text-accent-gold"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Variant Info */}
        {item.variant && (
          <p className="text-small text-secondary-grey">
            {[item.variant.size, item.variant.color]
              .filter(Boolean)
              .join(' / ')}
          </p>
        )}

        {/* Price + Quantity */}
        <div className="flex items-center justify-between">

          {/* Quantity Controls */}
          <div
            className="flex items-center border border-secondary-grey/40"
            role="group"
            aria-label="Quantity"
          >
            <button
              onClick={handleDecrease}
              disabled={isPending}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center
                         text-primary-white hover:text-accent-gold
                         transition-colors duration-150
                         focus-visible:outline-none 
                         focus-visible:text-accent-gold"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span
              className="w-8 h-8 flex items-center justify-center
                         text-small text-primary-white border-x 
                         border-secondary-grey/40"
              aria-live="polite"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isPending}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center
                         text-primary-white hover:text-accent-gold
                         transition-colors duration-150
                         focus-visible:outline-none 
                         focus-visible:text-accent-gold"
            >
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <p className="text-body text-primary-white">
            ₦{totalPrice.toLocaleString()}
          </p>

        </div>
      </div>
    </div>
  )
}