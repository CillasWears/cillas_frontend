import apiClient from './client'
import type { PaginatedResponse, Product, ProductSummary, BlogPost, BlogPostSummary, BlogTag } from '../../types'
import { getBlogTags } from './blog'

// Admin Product Management

export interface CreateProductPayload {
  name: string
  description: string
  basePrice: number
  categoryId: string
}

export interface UpdateProductPayload {
  name?: string
  description?: string
  basePrice?: number
  categoryId?: string
  isActive?: boolean
}

export interface CreateVariantPayload {
  size: string
  color: string
  price: number
  inventory: number
  sku: string
}

// POST /products (Admin only)
export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', payload)
  return data
}

// PUT /products/:id (Admin only)
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/products/${id}`, payload)
  return data
}

// DELETE /products/:id (Admin only)
export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/products/${id}`
  )
  return data
}

// POST /products/:productId/variants (Admin only)
export async function addProductVariant(
  productId: string,
  payload: CreateVariantPayload
): Promise<Product> {
  const { data } = await apiClient.post<Product>(
    `/products/${productId}/variants`,
    payload
  )
  return data
}

// DELETE /products/:productId/variants/:variantId (Admin only)
export async function deleteProductVariant(
  productId: string,
  variantId: string
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/products/${productId}/variants/${variantId}`
  )
  return data
}

// POST /products/:id/images (Admin only)
export async function addProductImage(
  productId: string,
  file: File,
  altText?: string,
  position?: number
): Promise<Product> {
  const formData = new FormData()
  formData.append('image', file, file.name)
  if (altText) formData.append('altText', altText)
  if (position !== undefined) formData.append('position', position.toString())

  const { data } = await apiClient.post<Product>(
    `/products/${productId}/images`,
    formData
  )
  return data
}

// DELETE /products/:id/images/:imageId (Admin only)
export async function deleteProductImage(
  productId: string,
  imageId: string
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/products/${productId}/images/${imageId}`
  )
  return data
}

// Admin Blog Management

export interface CreateBlogPostPayload {
  title: string
  content: string
  excerpt: string
  tagIds: string[]
}

export interface UpdateBlogPostPayload {
  title?: string
  content?: string
  excerpt?: string
  tagIds?: string[]
}

// GET /blog/admin (Admin only - includes drafts)
export async function getAdminBlogPosts(query: {
  page?: number
  limit?: number
}): Promise<PaginatedResponse<BlogPostSummary>> {
  const params: Record<string, string | number> = {}
  if (typeof query.page === 'number') params.page = query.page
  if (typeof query.limit === 'number') params.limit = query.limit

  const { data } = await apiClient.get<PaginatedResponse<BlogPostSummary>>(
    '/blog/admin',
    { params }
  )

  if (!Array.isArray(data.data)) {
    return data
  }

  const needsTagResolution = data.data.some((post) =>
    post.tags.some(
      (tag) =>
        typeof tag === 'string' ||
        (typeof tag === 'object' && tag !== null && (!tag.name || tag.name === tag.id))
    )
  )

  if (!needsTagResolution) {
    return data
  }

  const allTags = await getBlogTags()
  const tagByIdOrSlug = new Map<string, BlogTag>()
  for (const tag of allTags) {
    tagByIdOrSlug.set(tag.id, tag)
    if (tag.slug) tagByIdOrSlug.set(tag.slug.toLowerCase(), tag)
    tagByIdOrSlug.set(tag.name.toLowerCase(), tag)
  }

  return {
    ...data,
    data: data.data.map((post) => ({
      ...post,
      tags: Array.isArray(post.tags)
        ? post.tags.map((tag) => {
          if (typeof tag === 'string') {
            return tagByIdOrSlug.get(tag) ?? tagByIdOrSlug.get(String(tag).toLowerCase()) ?? { id: tag, name: tag }
          }
          const fallbackId = String(tag.id ?? '')
          const fallbackName = String(tag.name ?? fallbackId)
          const resolved =
            tagByIdOrSlug.get(fallbackId) ??
            tagByIdOrSlug.get(String(tag.slug ?? '').toLowerCase()) ??
            tagByIdOrSlug.get(fallbackName.toLowerCase())
          return resolved ?? { id: fallbackId || fallbackName, name: fallbackName }
        })
        : [],
    })),
  }
}

// POST /blog (Admin only)
export async function createBlogPost(
  payload: CreateBlogPostPayload
): Promise<BlogPost> {
  const { data } = await apiClient.post<BlogPost>('/blog', payload)
  return data
}

// PUT /blog/:id (Admin only)
export async function updateBlogPost(
  id: string,
  payload: UpdateBlogPostPayload
): Promise<BlogPost> {
  const { data } = await apiClient.put<BlogPost>(`/blog/${id}`, payload)
  return data
}

// DELETE /blog/:id (Admin only)
export async function deleteBlogPost(id: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(`/blog/${id}`)
  return data
}

// PATCH /blog/:id/publish (Admin only)
export async function publishBlogPost(id: string): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/blog/${id}/publish`)
  return data
}

// PATCH /blog/:id/unpublish (Admin only)
export async function unpublishBlogPost(id: string): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/blog/${id}/unpublish`)
  return data
}
