'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useUpdateOrderStatus } from '@/hooks'
import { parseApiError } from '@/lib/api'
import type { OrderStatus } from '@/types'

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: OrderStatus
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus)
  const [success, setSuccess] = useState(false)

  const {
    mutate: updateStatus,
    isPending,
    error,
  } = useUpdateOrderStatus()

  const apiError = error ? parseApiError(error) : null

  function handleUpdate() {
    if (selectedStatus === currentStatus) return
    updateStatus(
      { id: orderId, status: selectedStatus },
      {
        onSuccess: () => {
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        },
      }
    )
  }

  return (
    <div className="space-y-md">
      <h3 className="text-label text-primary-white">Update Status</h3>

      {/* Success */}
      {success && (
        <div
          role="status"
          className="border border-accent-gold/40 bg-accent-gold/10 
                     px-md py-sm"
        >
          <p className="text-small text-accent-gold">
            Order status updated successfully.
          </p>
        </div>
      )}

      {/* Error */}
      {apiError && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 
                     px-md py-sm"
        >
          <p className="text-small text-red-400">{apiError.message}</p>
        </div>
      )}

      <div className="flex items-center gap-md flex-wrap">
        <select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as OrderStatus)
          }
          aria-label="Select new order status"
          className="bg-primary-black border border-secondary-grey/40
                     text-primary-white text-small px-md py-sm
                     hover:border-secondary-grey focus:outline-none
                     focus:border-accent-gold transition-colors 
                     duration-150 cursor-pointer"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <Button
          variant="primary"
          size="sm"
          isLoading={isPending}
          disabled={selectedStatus === currentStatus}
          onClick={handleUpdate}
        >
          Update Status
        </Button>
      </div>
    </div>
  )
}
