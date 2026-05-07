'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'
import { useUserProfile } from '@/hooks'
import { useCheckoutStore } from '@/store/checkoutStore'
import AddAddressForm from './AddAddressForm'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Address } from '@/types'

export default function ShippingStep() {
  const { data: profile, isLoading } = useUserProfile()
  const { selectedAddressId, setSelectedAddressId, setStep } =
    useCheckoutStore()
  const [showAddForm, setShowAddForm] = useState(false)

  const addresses = profile?.addresses ?? []

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress =
        addresses.find((a: Address) => a.isDefault) || addresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
  }, [addresses, selectedAddressId, setSelectedAddressId])

  function handleContinue() {
    if (!selectedAddressId) return
    setStep('payment')
  }

  if (isLoading) {
    return (
      <div className="space-y-md">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-secondary-grey/10 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-xl">
      <h2 className="text-h2 text-primary-white font-primary">
        Shipping Address
      </h2>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-md">
          {addresses.map((address: Address) => (
            <button
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              aria-pressed={selectedAddressId === address.id}
              className={cn(
                'w-full text-left p-lg border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-accent-gold',
                selectedAddressId === address.id
                  ? 'border-accent-gold'
                  : 'border-secondary-grey/40 hover:border-secondary-grey'
              )}
            >
              <div className="flex items-start justify-between gap-md">
                <div className="flex items-start gap-md">
                  <MapPin
                    size={16}
                    strokeWidth={1.5}
                    className="text-accent-gold mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="space-y-xs">
                    <p className="text-body text-primary-white">
                      {address.street}
                    </p>
                    <p className="text-small text-secondary-grey">
                      {address.city}, {address.state}, {address.country}
                    </p>
                    {address.isDefault && (
                      <span className="text-small text-accent-gold">
                        Default address
                      </span>
                    )}
                  </div>
                </div>
                {selectedAddressId === address.id && (
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="text-accent-gold flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add New Address */}
      {showAddForm ? (
        <AddAddressForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-sm text-small 
                     text-secondary-grey hover:text-accent-gold
                     transition-colors duration-150 border 
                     border-dashed border-secondary-grey/40 
                     hover:border-accent-gold w-full p-lg
                     focus-visible:outline-none 
                     focus-visible:ring-2 focus-visible:ring-accent-gold"
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
          Add New Address
        </button>
      )}

      {/* Continue Button */}
      {!showAddForm && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedAddressId}
          onClick={handleContinue}
        >
          Continue to Payment
        </Button>
      )}
    </div>
  )
}