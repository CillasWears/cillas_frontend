import apiClient from './client'
import type { AuthResponse, User, SuccessResponse } from '../../types'

export interface LoginPayload {
 email: string
 password: string
}

export interface RegisterPayload {
 email: string
 password: string
 firstName: string
 lastName: string
}

export interface ForgotPasswordPayload {
 email: string
}

export interface ResetPasswordPayload {
 token: string
 newPassword: string
}

// POST /auth/register
export async function registerUser(
 payload: RegisterPayload
): Promise<AuthResponse> {
 const { data } = await apiClient.post<AuthResponse>(
  '/auth/register',
  payload
 )

 // Store token in localStorage after registration
 if (typeof window !== 'undefined' && data.accessToken) {
  localStorage.setItem('access_token', data.accessToken)
 }

 return data
}

// POST /auth/login
export async function loginUser(
 payload: LoginPayload
): Promise<AuthResponse> {
 const { data } = await apiClient.post<AuthResponse>(
  '/auth/login',
  payload
 )

 // Store token in localStorage
 if (typeof window !== 'undefined' && data.accessToken) {
  localStorage.setItem('access_token', data.accessToken)
 }

 return data
}

// GET /auth/me
export async function getMe(): Promise<User> {
 const { data } = await apiClient.get<User>('/auth/me')
 return data
}

// POST /auth/logout
export async function logoutUser(): Promise<SuccessResponse> {
 try {
  const { data } = await apiClient.post<SuccessResponse>('/auth/logout')
  return data

 } catch (error) {
  console.log('Backend logout endpoint not available, logging out locally only');
  return { message: 'Logged out locally' } as SuccessResponse;;
 }
}

// POST /auth/forgot-password
export async function forgotPassword(
 payload: ForgotPasswordPayload
): Promise<SuccessResponse> {
 const { data } = await apiClient.post<SuccessResponse>(
  '/auth/forgot-password',
  payload
 )
 return data
}

// POST /auth/reset-password
export async function resetPassword(
 payload: ResetPasswordPayload
): Promise<SuccessResponse> {
 const { data } = await apiClient.post<SuccessResponse>(
  '/auth/reset-password',
  payload
 )
 return data
}