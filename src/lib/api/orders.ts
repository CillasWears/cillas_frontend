import apiClient from './client'
import type {
  Order,
  OrderSummary,
  OrderItem,
  PaginatedResponse,
  SuccessResponse,
} from '../../types'

export interface CreateOrderPayload {
  addressId: string
  shippingAddress?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

// POST /orders - Creates order from cart
// Requires addressId (existing address) or shippingAddress (new address)

type CreateOrderResponse = {
  message: string
  order: Order
}
export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const { data } = await apiClient.post<CreateOrderResponse>('/orders', payload)
  return data
}

// GET /orders
export async function getOrders(): Promise<PaginatedResponse<OrderSummary>> {
  const { data } = await apiClient.get<
    PaginatedResponse<OrderSummary> | OrderSummary[]
  >(
    '/orders'
  )

  // Normalize backend responses:
  // - Paginated shape: { data: OrderSummary[], meta: {...} }
  // - Array shape: OrderSummary[]
  if (Array.isArray(data)) {
    return {
      data,
      meta: {
        total: data.length,
        page: 1,
        limit: data.length || 12,
        totalPages: Math.ceil(data.length / 10) || 1,
      },
    }
  }

  return data
}

// GET /orders/:id
export async function getOrderById(id: string): Promise<Order> {
  type BackendOrderItem = {
    id: string
    quantity: number
    unitPrice: string | number
    product: {
      id: string
      name: string
    }
    variant?: {
      size: string
      color: string
    }
  }

  type BackendOrder = Omit<Order, 'items'> & {
    items: BackendOrderItem[]
  }

  const { data } = await apiClient.get<BackendOrder>(`/orders/${id}`)

  const normalizedItems: OrderItem[] = data.items.map((item) => {
    return {
      id: item.id,
      product: item.product,
      variant: item.variant,
      quantity: item.quantity,
      price: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
    }
  })

  return {
    ...data,
    items: normalizedItems,
  }
}

// PATCH /orders/:id/cancel
export async function cancelOrder(id: string): Promise<SuccessResponse> {
  const { data } = await apiClient.patch<SuccessResponse>(
    `/orders/${id}/cancel`
  )
  return data
}