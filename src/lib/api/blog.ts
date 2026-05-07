import apiClient from './client'
import type { BlogPost, BlogPostSummary, BlogTag, PaginatedResponse } from '../../types/index'
import axios from 'axios'

export interface BlogQuery {
  page?: number
  limit?: number
  tag?: string
  search?: string
}

type UnknownTag = string | Partial<BlogTag> | null | undefined

function buildTagLookup(tags: BlogTag[]): Map<string, BlogTag> {
  const lookup = new Map<string, BlogTag>()
  for (const tag of tags) {
    lookup.set(tag.id, tag)
    lookup.set(tag.name.toLowerCase(), tag)
    if (tag.slug) lookup.set(tag.slug.toLowerCase(), tag)
  }
  return lookup
}

function normalizeTag(tag: UnknownTag, lookup?: Map<string, BlogTag>): BlogTag {
  if (typeof tag === 'string') {
    const matched = lookup?.get(tag) ?? lookup?.get(tag.toLowerCase())
    if (matched) return matched
    return { id: tag, name: tag }
  }

  const raw = tag ?? {}
  const id = String(raw.id ?? '')
  const fallbackName = String(raw.name ?? id)
  const slug = raw.slug ? String(raw.slug) : undefined
  const lookupKey = (slug || id || fallbackName).toLowerCase()
  const matched = lookup?.get(id) ?? lookup?.get(lookupKey)

  return {
    id: id || matched?.id || fallbackName,
    name: matched?.name || fallbackName,
    slug: slug || matched?.slug,
  }
}

function normalizePostTags<T extends BlogPostSummary | BlogPost>(
  post: T,
  lookup?: Map<string, BlogTag>
): T {
  return {
    ...post,
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag) => normalizeTag(tag, lookup))
      : [],
  }
}

function normalizeBlogListResponse(
  raw: unknown
): PaginatedResponse<BlogPostSummary> {
  const fallback: PaginatedResponse<BlogPostSummary> = {
    data: [],
    meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
  }

  if (!raw || typeof raw !== 'object') return fallback

  const payload = raw as Record<string, unknown>

  // Expected shape from backend docs: { data: BlogPostSummary[], meta: {...} }
  if (Array.isArray(payload.data) && payload.meta) {
    return payload as unknown as PaginatedResponse<BlogPostSummary>
  }
  // Common wrapped shape: { data: { data: BlogPostSummary[], meta: {...} } }
  if (
    payload.data &&
    typeof payload.data === 'object' &&
    Array.isArray((payload.data as Record<string, unknown>).data) &&
    (payload.data as Record<string, unknown>).meta
  ) {
    return payload.data as unknown as PaginatedResponse<BlogPostSummary>
  }

  return fallback
}

// GET /blog
export async function getBlogPosts(
  query: BlogQuery = {}
): Promise<PaginatedResponse<BlogPostSummary>> {
  const params: Record<string, string | number> = {}
  if (typeof query.page === 'number') params.page = query.page
  if (typeof query.limit === 'number') params.limit = query.limit
  if (query.tag) params.tag = query.tag
  if (query.search) params.search = query.search

  try {
    const { data } = await apiClient.get('/blog', { params })
    const response = normalizeBlogListResponse(data)
    const shouldResolveTagNames = response.data.some((post) =>
      post.tags.some(
        (tag) =>
          typeof tag === 'string' ||
          (typeof tag === 'object' && tag !== null && (!tag.name || tag.name === tag.id))
      )
    )

    if (!shouldResolveTagNames) {
      return response
    }

    const tags = await getBlogTags()
    const tagLookup = buildTagLookup(tags)

    return {
      ...response,
      data: response.data.map((post) => normalizePostTags(post, tagLookup)),
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const messages = error.response?.data?.message
      const messageList = Array.isArray(messages) ? messages : []
      const hasPageValidationIssue = messageList.some(
        (msg) =>
          typeof msg === 'string' &&
          (msg.includes('page must be') || msg.includes('limit must be'))
      )

      // Backend currently validates query params as numbers before transforming.
      // Retry without pagination params so public blog listing still works.
      if (hasPageValidationIssue) {
        const fallbackParams: Record<string, string> = {}
        if (query.tag) fallbackParams.tag = query.tag
        if (query.search) fallbackParams.search = query.search

        const { data } = await apiClient.get('/blog', { params: fallbackParams })
        const response = normalizeBlogListResponse(data)
        return {
          ...response,
          data: response.data.map((post) => normalizePostTags(post)),
        }
      }
    }
    throw error
  }
}

// GET /blog/:slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const { data } = await apiClient.get<BlogPost>(`/blog/${slug}`)

  const needsTagResolution = data.tags.some(
    (tag) =>
      typeof tag === 'string' ||
      (typeof tag === 'object' && tag !== null && (!tag.name || tag.name === tag.id))
  )

  if (!needsTagResolution) {
    return normalizePostTags(data)
  }

  const tags = await getBlogTags()
  const tagLookup = buildTagLookup(tags)
  return normalizePostTags(data, tagLookup)
}

// GET /blog/tags
export async function getBlogTags(): Promise<BlogTag[]> {
  const { data } = await apiClient.get<BlogTag[]>('/blog/tags')
  return Array.isArray(data)
    ? data.map((tag) => ({
      id: String(tag.id),
      name: String(tag.name),
      slug: tag.slug ? String(tag.slug) : undefined,
    }))
    : []
}
