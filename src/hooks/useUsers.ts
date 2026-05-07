'use client'

import { useEffect, useState } from 'react'
import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import {
 getUserProfile,
 updateUserProfile,
 addAddress,
 deleteAddress,
 type UpdateProfilePayload,
 type AddAddressPayload,
 parseApiError,
} from '@/lib/api'

const userKeys = {
 profile: ['users', 'profile'] as const,
}

export function useUserProfile() {
 const [isClient, setIsClient] = useState(false)
 const [hasToken, setHasToken] = useState(false)

 useEffect(() => {
  setIsClient(true)
  setHasToken(!!localStorage.getItem('access_token'))
 }, [])

 return useQuery({
  queryKey: userKeys.profile,
  queryFn: getUserProfile,
  retry: false,
  enabled: isClient && hasToken, // Only run query if token exists
 })
}

export function useUpdateProfile() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (payload: UpdateProfilePayload) =>
   updateUserProfile(payload),
  onSuccess: (data) => {
   queryClient.setQueryData(userKeys.profile, data)
  },
  onError: (error) => parseApiError(error),
 })
}

export function useAddAddress() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (payload: AddAddressPayload) => addAddress(payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: userKeys.profile })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useDeleteAddress() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (id: string) => deleteAddress(id),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: userKeys.profile })
  },
  onError: (error) => parseApiError(error),
 })
}