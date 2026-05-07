'use client'

import { useMutation } from '@tanstack/react-query'
import {
 initializePayment,
 verifyPayment,
 type InitializePaymentPayload,
 type VerifyPaymentPayload,
} from '@/lib/api'
import { parseApiError } from '@/lib/api'

export function useInitializePayment() {
 return useMutation({
  mutationFn: (payload: InitializePaymentPayload) =>
   initializePayment(payload),
  onError: (error) => parseApiError(error),
 })
}

export function useVerifyPayment() {
 return useMutation({
  mutationFn: (payload: VerifyPaymentPayload) => verifyPayment(payload),
  onError: (error) => parseApiError(error),
 })
}