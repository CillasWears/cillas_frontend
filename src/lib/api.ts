import axios from 'axios';
import type { AxiosError } from 'axios';
import { apiClient } from './api';

export interface ApiError {
 message: string;
 statusCode?: number;
 errors?: Record<string, string>;
}

export function parseApiError(error: unknown): ApiError {
 const axiosError = error as AxiosError<any>;
 if (axiosError.isAxiosError) {
  return {
   message: axiosError.response?.data?.message || axiosError.message,
   statusCode: axiosError.response?.status,
   errors: axiosError.response?.data?.errors
  };
 }
 return { message: 'An unknown error occurred' };
}

export * from './api/index';

export interface UpdateProfilePayload {
 firstName?: string;
 lastName?: string;
 phone?: string;
}

export interface AddAddressPayload {
 street: string;
 city: string;
 state: string;
 country: string;
 isDefault?: boolean;
}

export async function getUserProfile() {
 // const response = await axios.get('/users/profile');
 const response = await apiClient.get('/users/profile');
 return response.data;
}

export async function updateUserProfile(payload: UpdateProfilePayload) {
 const response = await apiClient.put('/users/profile', payload);
 return response.data;
}

export async function addAddress(payload: AddAddressPayload) {
 const response = await apiClient.post('/users/address', payload);
 return response.data;
}

export async function deleteAddress(id: string) {
 const response = await apiClient.delete(`/users/address/${id}`);
 return response.data;
}

// Cart API functions
export interface AddToCartPayload {
 productId: string;
 variantId: string;
 quantity: number;
}

export interface UpdateCartItemPayload {
 quantity: number;
}

export async function getCart() {
 const response = await apiClient.get('/cart');
 return response.data;
}

export async function addToCart(payload: AddToCartPayload) {
 const response = await apiClient.post('/cart', payload);
 return response.data;
}

export async function updateCartItem(itemId: string, payload: UpdateCartItemPayload) {
 const response = await apiClient.put(`/cart/${itemId}`, payload);
 return response.data;
}

export async function removeCartItem(itemId: string) {
 const response = await apiClient.delete(`/cart/${itemId}`);
 return response.data;
}
