import apiClient from './client'
import type { InitializePaymentResponse, VerifyPaymentResponse } from '../../types'

export interface InitializePaymentPayload {
 orderId: string
}

export interface VerifyPaymentPayload {
 reference: string
}

// POST /payments/initialize
export async function initializePayment(
 payload: InitializePaymentPayload
): Promise<InitializePaymentResponse> {
 const { data } = await apiClient.post<InitializePaymentResponse>(
  '/payments/initialize',
  payload
 )
 return data
}

// POST /payments/verify
export async function verifyPayment(
 payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> {
 const { data } = await apiClient.post<VerifyPaymentResponse>(
  '/payments/verify',
  payload
 )
 return data
}