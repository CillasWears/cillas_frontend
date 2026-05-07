'use client'

import { useEffect, useState } from 'react'
import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import {
 getCart,
 addToCart,
 updateCartItem,
 removeCartItem,
 type AddToCartPayload,
 type UpdateCartItemPayload,
} from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'

export function useCart() {
 const [isClient, setIsClient] = useState(false)
 const [hasToken, setHasToken] = useState(false)

 useEffect(() => {
  setIsClient(true)
  setHasToken(!!localStorage.getItem('access_token'))
 }, [])

 return useQuery({
  queryKey: queryKeys.cart.all,
  queryFn: getCart,
  retry: false,
  enabled: isClient && hasToken,
 })
}

export function useAddToCart() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (payload: AddToCartPayload) => addToCart(payload),
  onSuccess: (updatedCart) => {
   queryClient.setQueryData(queryKeys.cart.all, updatedCart)
  },
 })
}

export function useUpdateCartItem() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: ({
   itemId,
   payload,
  }: {
   itemId: string
   payload: UpdateCartItemPayload
  }) => updateCartItem(itemId, payload),
  onSuccess: (updatedCart) => {
   queryClient.setQueryData(queryKeys.cart.all, updatedCart)
  },
 })
}

export function useRemoveCartItem() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (itemId: string) => removeCartItem(itemId),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })
  },
 })
}
