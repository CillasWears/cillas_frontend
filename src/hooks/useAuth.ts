'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
 getMe,
 loginUser,
 registerUser,
 logoutUser,
 forgotPassword,
 resetPassword,
 type LoginPayload,
 type RegisterPayload,
 type ForgotPasswordPayload,
 type ResetPasswordPayload
} from '@/lib/api/auth'
import { queryKeys } from '@/constants/queryKeys'

export function useMe() {
 const [isClient, setIsClient] = useState(false)
 const [hasToken, setHasToken] = useState(false)

 useEffect(() => {
  setIsClient(true)
  setHasToken(!!localStorage.getItem('access_token'))
 }, [])

 return useQuery({
  queryKey: queryKeys.auth.me,
  queryFn: getMe,
  retry: false,
  enabled: isClient && hasToken,
 })
}

export function useLogin() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (payload: LoginPayload) => loginUser(payload),
  onSuccess: () => {
   // Invalidate and refetch the user data after successful login
   queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
   queryClient.refetchQueries({ queryKey: queryKeys.auth.me })
  }
 })
}

export function useRegister() {
 return useMutation({
  mutationFn: (payload: RegisterPayload) => registerUser(payload),
 })
}

export function useForgotPassword() {
 return useMutation({
  mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
 })
}

export function useResetPassword() {
 return useMutation({
  mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
 })
}

export function useLogout() {
 return useMutation({
  mutationFn: () => logoutUser(),
  onSuccess: () => {
   if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    window.location.href = '/auth/login'
   }
  }
 })
}
