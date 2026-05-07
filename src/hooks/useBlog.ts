'use client'

import { useQuery } from '@tanstack/react-query'
import {
 getBlogPosts,
 getBlogPostBySlug,
 getBlogTags,
} from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'
import type { BlogQuery } from '@/lib/api/blog'

export function useBlogPosts(query: BlogQuery = {}) {
 return useQuery({
  queryKey: queryKeys.blog.list({ ...query }),
  queryFn: () => getBlogPosts(query),
 })
}

export function useBlogPost(slug: string) {
 return useQuery({
  queryKey: queryKeys.blog.detail(slug),
  queryFn: () => getBlogPostBySlug(slug),
  enabled: !!slug,
 })
}

export function useBlogTags() {
 return useQuery({
  queryKey: ['blog', 'tags'] as const,
  queryFn: getBlogTags,
  staleTime: 10 * 60 * 1000, // 10 minutes
 })
}
