'use client'

import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import { getOrders, getOrderById } from '@/lib/api'
import { parseApiError } from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'
import apiClient from '@/lib/api/client'
import type { Order, OrderStatus } from '@/types'

export function useAdminOrders(page = 1, limit = 10) {
 return useQuery({
  queryKey: queryKeys.orders.all,
  queryFn: () => getOrders(),
 })
}

export function useAdminOrder(id: string) {
 return useQuery({
  queryKey: queryKeys.orders.detail(id),
  queryFn: () => getOrderById(id),
  enabled: !!id,
 })
}

export function useUpdateOrderStatus() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: async ({
   id,
   status,
  }: {
   id: string
   status: OrderStatus
  }) => {
   const { data } = await apiClient.patch<Order>(
    `/orders/${id}/status`,
    { status }
   )
   return data
  },
  onSuccess: (_, variables) => {
   queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
   queryClient.invalidateQueries({
    queryKey: queryKeys.orders.detail(variables.id),
   })
  },
  onError: (error) => parseApiError(error),
 })
}
