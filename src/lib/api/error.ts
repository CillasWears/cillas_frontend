import { AxiosError } from 'axios'

export interface ApiError {
 message: string
 statusCode: number
 errors?: Record<string, string[]>
}

export function parseApiError(error: unknown): ApiError {
 if (error instanceof AxiosError) {
  const data = error.response?.data as {
   message?: string | string[]
   statusCode?: number
   errors?: Record<string, string[]>
  }

  const message = Array.isArray(data?.message)
   ? data.message[0]
   : data?.message ?? 'An unexpected error occurred'

  return {
   message,
   statusCode: error.response?.status ?? 500,
   errors: data?.errors,
  }
 }

 if (error instanceof Error) {
  return {
   message: error.message,
   statusCode: 500,
  }
 }

 return {
  message: 'An unexpected error occurred',
  statusCode: 500,
 }
}

export function isApiError(error: unknown): error is AxiosError {
 return error instanceof AxiosError
}