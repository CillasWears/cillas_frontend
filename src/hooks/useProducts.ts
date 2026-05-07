'use client'

import { useQuery } from '@tanstack/react-query'
import {
 getProducts,
 getProductBySlug,
 getCategories,
 type ProductsQuery,
 CategoryItem
} from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'

export function useProducts(query: ProductsQuery = {}) {
 return useQuery({
  queryKey: queryKeys.products.list(query as Record<string, unknown>),
  queryFn: () => getProducts(query),
 })
}

export function useProductBySlug(slug: string) {
 return useQuery({
  queryKey: queryKeys.products.detail(slug),
  queryFn: () => getProductBySlug(slug),
  enabled: !!slug,
 })
}

export function useCategories() {
 return useQuery({
  queryKey: queryKeys.categories.all,
  queryFn: getCategories,
  staleTime: 10 * 60 * 1000 // 10 minutes
 })
}