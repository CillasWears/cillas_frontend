import axios from 'axios'
import apiClient from './client'
import type { PaginatedResponse, ProductSummary, Product } from '../../types'

// Category type
export interface CategoryItem {
 id: string
 name: string
 slug: string
}

// GET /categories (public)
export async function getCategories(): Promise<CategoryItem[]> {
 const { data } = await apiClient.get<CategoryItem[]>('/categories')
 return data
}

export interface ProductsQuery {
 page?: number
 limit?: number
 search?: string
 categoryId?: string
 sortBy?: string
 minPrice?: number
 maxPrice?: number
}

// GET /products
export async function getProducts(
 query: ProductsQuery = {}
): Promise<PaginatedResponse<ProductSummary>> {

 try {
  console.log('📡 Fetching products from:', process.env.NEXT_PUBLIC_API_URL)
  // Build params - ONLY include fields that exist in your backend DTO
  const params: Record<string, any> = {}

  if (query.page !== undefined) params.page = Number(query.page)
  if (query.limit !== undefined) params.limit = Number(query.limit)
  if (query.categoryId) params.categoryId = query.categoryId
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.minPrice !== undefined) params.minPrice = Number(query.minPrice)
  if (query.maxPrice !== undefined) params.maxPrice = Number(query.maxPrice)

  // console.log('📦 Params to send:', params)

  const { data } = await apiClient.get<PaginatedResponse<ProductSummary>>(
   '/products',
   { params }
  )
  // console.log('✅ Products response:', data)
  return data

 } catch (error) {
  console.error('❌ Error fetching products:', error)
  if (axios.isAxiosError(error)) {
   console.error('Response status:', error.response?.status)
   console.error('Response data:', error.response?.data)
  }
  // Return empty data structure
  return {
   data: [],
   meta: {
    total: 0,
    page: query.page || 1,
    limit: query.limit || 12,
    totalPages: 0
   }
  }
 }

}

// GET /products/:slug
export async function getProductBySlug(slug: string): Promise<Product> {
 const { data } = await apiClient.get<Product>(`/products/${slug}`)
 return data
}