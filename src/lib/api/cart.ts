import apiClient from './client'
import type { Cart } from '../../types/index'

export interface AddToCartPayload {
 productId: string
 variantId?: string
 quantity: number
}

export interface UpdateCartItemPayload {
 quantity: number
}

// GET /cart
export async function getCart(): Promise<Cart> {
 const { data } = await apiClient.get<Cart>('/cart')
 return data
}

// POST /cart
export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
 const { data } = await apiClient.post<Cart>('/cart', payload)
 return data
}

// PUT /cart/:itemId
export async function updateCartItem(
 itemId: string,
 payload: UpdateCartItemPayload
): Promise<Cart> {
 const { data } = await apiClient.put<Cart>(
  `/cart/${itemId}`,
  payload
 )
 return data
}

// DELETE /cart/:itemId
export async function removeCartItem(itemId: string): Promise<Cart> {
 const { data } = await apiClient.delete<Cart>(
  `/cart/${itemId}`
 )
 return data
}
