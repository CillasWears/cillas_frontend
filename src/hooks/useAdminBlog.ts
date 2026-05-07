'use client'

import {
 useQuery,
 useMutation,
 useQueryClient,
} from '@tanstack/react-query'
import {
 getAdminBlogPosts,
 getBlogPostBySlug,
 createBlogPost,
 updateBlogPost,
 deleteBlogPost,
 publishBlogPost,
 unpublishBlogPost,
 getBlogTags,
 type CreateBlogPostPayload,
 type UpdateBlogPostPayload,
} from '../lib/api'
import { parseApiError } from '../lib/api'

const blogAdminKeys = {
 all: ['admin', 'blog'] as const,
 list: (query: Record<string, unknown>) =>
  ['admin', 'blog', 'list', query] as const,
 detail: (slug: string) => ['admin', 'blog', 'detail', slug] as const,
 tags: ['blog', 'tags'] as const,
}

export function useAdminBlogPosts(page = 1, limit = 10) {
 return useQuery({
  queryKey: blogAdminKeys.list({ page, limit }),
  queryFn: () => getAdminBlogPosts({ page, limit }),
 })
}

export function useAdminBlogPost(slug: string) {
 return useQuery({
  queryKey: blogAdminKeys.detail(slug),
  queryFn: () => getBlogPostBySlug(slug),
  enabled: !!slug,
 })
}

export function useAdminBlogTags() {
 return useQuery({
  queryKey: blogAdminKeys.tags,
  queryFn: getBlogTags,
  staleTime: 10 * 60 * 1000,
 })
}

export function useCreateBlogPost() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (payload: CreateBlogPostPayload) =>
   createBlogPost(payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: blogAdminKeys.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useUpdateBlogPost() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: ({
   id,
   payload,
  }: {
   id: string
   payload: UpdateBlogPostPayload
  }) => updateBlogPost(id, payload),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: blogAdminKeys.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useDeleteBlogPost() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (id: string) => deleteBlogPost(id),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: blogAdminKeys.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function usePublishBlogPost() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (id: string) => publishBlogPost(id),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: blogAdminKeys.all })
  },
  onError: (error) => parseApiError(error),
 })
}

export function useUnpublishBlogPost() {
 const queryClient = useQueryClient()
 return useMutation({
  mutationFn: (id: string) => unpublishBlogPost(id),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: blogAdminKeys.all })
  },
  onError: (error) => parseApiError(error),
 })
}
