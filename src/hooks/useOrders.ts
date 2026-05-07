'use client'

import { useEffect, useState } from 'react'
import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import {
 getOrders,
 getOrderById,
 createOrder,
 type CreateOrderPayload,
} from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'
import type { Order } from '@/types'

export function useOrders() {
 const [isClient, setIsClient] = useState(false)
 const [hasToken, setHasToken] = useState(false)

 useEffect(() => {
  setIsClient(true)
  const token = localStorage.getItem('access_token')
  setHasToken(!!token)
  // console.log('🔑 Token exists:', !!token)
 }, [])

 const query = useQuery({
  queryKey: queryKeys.orders.all,
  queryFn: getOrders,
  retry: false,
  enabled: isClient && hasToken,
 })

 // console.log('📊 useOrders query result:', {
 //  isLoading: query.isLoading,
 //  isError: query.isError,
 //  error: query.error,
 //  data: query.data,
 //  enabled: isClient && hasToken
 // })


 return query
}

export function useOrder<T extends Order>(id: string) {
 return useQuery<T>({
  queryKey: queryKeys.orders.detail(id),
  queryFn: () => getOrderById(id) as Promise<T>,
  enabled: !!id,
 })
}


export function useCreateOrder() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: async (payload: CreateOrderPayload) => {
   const response = await createOrder(payload)
   return response.order   // ✅ now fully typed
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
   queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })
  },
 })
}