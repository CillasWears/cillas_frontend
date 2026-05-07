'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useCart, useMe } from '@/hooks'
import CartItem from './CartItem'
import Button from '../ui/Button'
import { cn } from '../../lib/utils/cn'

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartStore()
  const { data: user } = useMe()
  const { data: cart, isLoading } = useCart()

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeCart])

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum: number, item: typeof items[number]) => {
    const price = item.variant?.price ?? item.product.basePrice
    return sum + price * item.quantity
  }, 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary-black/70 
                     backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md',
          'bg-primary-black border-l border-secondary-grey/20',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-xl py-lg 
                     border-b border-secondary-grey/20"
        >
          <div className="flex items-center gap-sm">
            <ShoppingBag
              size={20}
              strokeWidth={1.5}
              className="text-accent-gold"
              aria-hidden="true"
            />
            <h2 className="text-h3 text-primary-white font-primary">
              Your Cart
              {items.length > 0 && (
                <span className="text-secondary-grey ml-sm 
                                 font-secondary text-body">
                  ({items.length})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-secondary-grey hover:text-accent-gold 
                       transition-colors duration-150
                       focus-visible:outline-none 
                       focus-visible:ring-2 focus-visible:ring-accent-gold"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-xl">
          {!user ? (
            /* Not logged in */
            <div
              className="flex flex-col items-center justify-center 
                         h-full space-y-lg text-center"
            >
              <ShoppingBag
                size={48}
                strokeWidth={1}
                className="text-secondary-grey/40"
                aria-hidden="true"
              />
              <p className="text-body text-secondary-grey">
                Sign in to view your cart
              </p>
              <Link href="/auth/login" onClick={closeCart}>
                <Button variant="primary">Sign In</Button>
              </Link>
            </div>
          ) : isLoading ? (
            /* Loading */
            <div className="space-y-lg py-lg">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-md py-lg border-b 
                             border-secondary-grey/20"
                >
                  <div
                    className="w-20 h-24 bg-secondary-grey/10 
                               animate-pulse flex-shrink-0"
                  />
                  <div className="flex-1 space-y-sm">
                    <div
                      className="h-4 bg-secondary-grey/10 
                                 animate-pulse w-3/4"
                    />
                    <div
                      className="h-4 bg-secondary-grey/10 
                                 animate-pulse w-1/2"
                    />
                    <div
                      className="h-8 bg-secondary-grey/10 
                                 animate-pulse w-1/3"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty cart */
            <div
              className="flex flex-col items-center justify-center 
                         h-full space-y-lg text-center"
            >
              <ShoppingBag
                size={48}
                strokeWidth={1}
                className="text-secondary-grey/40"
                aria-hidden="true"
              />
              <p className="text-body text-secondary-grey">
                Your cart is empty
              </p>
              <Link href="/shop" onClick={closeCart}>
                <Button variant="secondary">Browse Collection</Button>
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div>
              {items.map((item: typeof items[number]) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer — only show when cart has items */}
        {user && items.length > 0 && (
          <div
            className="px-xl py-lg border-t border-secondary-grey/20 
                       space-y-lg"
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <p className="text-body text-secondary-grey">Subtotal</p>
              <p className="text-h3 text-primary-white font-primary">
                ₦{subtotal.toLocaleString()}
              </p>
            </div>

            <p className="text-small text-secondary-grey/60">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout CTA */}
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full text-small text-secondary-grey 
                         hover:text-accent-gold transition-colors 
                         duration-150 text-center
                         focus-visible:outline-none 
                         focus-visible:text-accent-gold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}