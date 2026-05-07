'use client'

import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import {
 getProducts,
 getProductBySlug,
 createProduct,
 updateProduct,
 deleteProduct,
 addProductVariant,
 deleteProductVariant,
 addProductImage,
 deleteProductImage,
 type CreateProductPayload,
 type UpdateProductPayload,
 type CreateVariantPayload,
} from '@/lib/api'
import { parseApiError } from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'

export function useAdminProducts(page = 1, limit = 10) {
 return useQuery({
  queryKey: queryKeys.products.list({ page, limit }),
  queryFn: () => getProducts({ page, limit }),
 })
}

export function useCreateProduct() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (payload: CreateProductPayload) => createProduct(payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useUpdateProduct() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: ({
   id,
   payload,
  }: {
   id: string
   payload: UpdateProductPayload
  }) => updateProduct(id, payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useDeleteProduct() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (id: string) => deleteProduct(id),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useAddVariant() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: ({
   productId,
   payload,
  }: {
   productId: string
   payload: CreateVariantPayload
  }) => addProductVariant(productId, payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useDeleteVariant() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: ({
   productId,
   variantId,
  }: {
   productId: string
   variantId: string
  }) => deleteProductVariant(productId, variantId),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useAddProductImage() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: ({
   productId,
   file,
   altText,
   position,
  }: {
   productId: string
   file: File
   altText?: string
   position?: number
  }) => addProductImage(productId, file, altText, position),
  onSuccess: (_, variables) => {
   queryClient.invalidateQueries({
    queryKey: queryKeys.products.detail(variables.productId),
   })
   queryClient.invalidateQueries({
    queryKey: queryKeys.products.all,
   })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useDeleteProductImage() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: ({
   productId,
   imageId,
  }: {
   productId: string
   imageId: string
  }) => deleteProductImage(productId, imageId),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useAdminProduct(slug: string) {
 return useQuery({
  queryKey: queryKeys.products.detail(slug),
  queryFn: () => getProductBySlug(slug),
  enabled: !!slug,
 })
}
