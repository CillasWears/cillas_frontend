import axios, { AxiosError, type AxiosInstance } from 'axios'

function resolveApiBaseUrl(): string | undefined {
 const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_INTERNAL_API_URL

 if (!baseUrl) {
  if (typeof window === 'undefined') {
   console.error(
    'API base URL is missing. Set NEXT_PUBLIC_API_URL (or API_URL) in your environment.'
   )
  }
  return undefined
 }

 return baseUrl.replace(/\/+$/, '')
}

const apiClient: AxiosInstance = axios.create({
 baseURL: resolveApiBaseUrl(),
 withCredentials: true,
 timeout: 10000,
})

// Request interceptor — attach Bearer token if available
apiClient.interceptors.request.use(
 (config) => {
  if (typeof window !== 'undefined') {
   const token = localStorage.getItem('access_token')
   if (token) {
    config.headers.Authorization = `Bearer ${token}`
   }
  }

  // Set Content-Type to application/json for non-FormData requests
  if (!(config.data instanceof FormData)) {
   config.headers['Content-Type'] = 'application/json'
  }

  return config
 },
 (error: AxiosError) => Promise.reject(error)
)

// Response interceptor — handle 401
apiClient.interceptors.response.use(
 (response) => response,
 async (error: AxiosError) => {
  if (error.response?.status === 401) {
   if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    // Only redirect if not already on an auth page
    const currentPath = window.location.pathname
    const isAuthPage = currentPath.startsWith('/auth/')
    if (!isAuthPage) {
     window.location.href = '/auth/login'
    }
   }
  }
  return Promise.reject(error)
 }
)

export default apiClient