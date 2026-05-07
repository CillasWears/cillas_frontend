'use client'

import { useState } from 'react'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { useUserProfile, useDeleteAddress } from '@/hooks/useUsers'
import AddAddressForm from '@/components/checkout/AddAddressForm'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Address } from '@/types'

export default function AddressesPage() {
  const { data: profile, isLoading } = useUserProfile()
  const { mutate: deleteAddress, isPending: isDeleting } =
    useDeleteAddress()
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addresses = profile?.addresses ?? []

  function handleDelete(id: string) {
    setDeletingId(id)
    deleteAddress(id, {
      onSettled: () => setDeletingId(null),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-md">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2xl">

      {/* Section Header */}
      <div className="space-y-sm pb-lg border-b border-secondary-grey/20">
        <h2 className="text-h3 text-primary-white font-primary">
          Saved Addresses
        </h2>
        <p className="text-body text-secondary-grey">
          Manage your shipping addresses
        </p>
      </div>

      {/* Addresses List */}
      {addresses.length > 0 && (
        <div className="space-y-md">
          {addresses.map((address: Address) => (
            <div
              key={address.id}
              className={cn(
                'flex items-start justify-between gap-md',
                'p-lg border border-secondary-grey/20',
                'transition-opacity duration-150',
                deletingId === address.id && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex items-start gap-md flex-1">
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

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(address.id)}
                disabled={isDeleting}
                aria-label={`Delete address: ${address.street}`}
                className="text-secondary-grey hover:text-red-400
                           transition-colors duration-150 flex-shrink-0
                           focus-visible:outline-none 
                           focus-visible:ring-2 
                           focus-visible:ring-accent-gold p-sm"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {addresses.length === 0 && !showAddForm && (
        <div
          className="flex flex-col items-center justify-center 
                     py-3xl space-y-lg border border-secondary-grey/20
                     text-center"
        >
          <MapPin
            size={48}
            strokeWidth={1}
            className="text-secondary-grey/40"
            aria-hidden="true"
          />
          <p className="text-h3 text-primary-white font-primary">
            No addresses saved
          </p>
          <p className="text-body text-secondary-grey">
            Add a shipping address to speed up checkout.
          </p>
        </div>
      )}

      {/* Add Address Form */}
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

    </div>
  )
}
