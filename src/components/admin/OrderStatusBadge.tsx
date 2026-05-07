import Badge from '@/components/ui/Badge'
import type { OrderStatus } from '@/types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

function getStatusVariant(
  status: OrderStatus
): 'gold' | 'default' | 'outline' {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return 'gold'
    case 'PROCESSING':
    case 'SHIPPED':
      return 'outline'
    default:
      return 'default'
  }
}

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return <Badge label={status} variant={getStatusVariant(status)} />
}
