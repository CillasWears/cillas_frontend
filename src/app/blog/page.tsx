import type { Metadata } from 'next'
import { Suspense } from 'react'
import Container from '@/components/layout/Container'
import BlogCard from '@/components/blog/BlogCard'
import FeaturedBlogPost from '@/components/blog/FeaturedBlogPost'
import BlogTagPills from '@/components/blog/BlogTagPills'
import Pagination from '@/components/ui/Pagination'
import { getBlogPosts } from '@/lib/api'
import type { BlogPostSummary, PaginatedResponse } from '@/types'

export const metadata: Metadata = {
  title: "Stories — Cilla's Wears",
  description:
    "Explore stories about African culture, heritage, fashion, and the inspiration behind Cilla's Wears collections.",
  openGraph: {
    title: "Stories — Cilla's Wears",
    description:
      "Explore stories about African culture, heritage, and fashion.",
  },
}

export const revalidate = 3600

interface BlogPageProps {
  searchParams: {
    page?: string
    tag?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 9

  let posts: PaginatedResponse<BlogPostSummary> = {
    data: [],
    meta: { total: 0, page: 1, limit, totalPages: 0 },
  }

  try {
    posts = await getBlogPosts({
      page,
      limit,
      tag: params.tag,
    })
  } catch (error) {
    console.error('Failed to load blog posts', error)
    // Empty state handled below
  }

  const featuredPost = !params.tag && page === 1
    ? posts.data[0]
    : null
  const remainingPosts = featuredPost
    ? posts.data.slice(1)
    : posts.data

  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>

        {/* Page Header */}
        <div className="py-xl space-y-sm">
          <p className="text-label text-accent-gold">
            From the Journal
          </p>
          <h1 className="text-h1 text-primary-white font-primary">
            Stories
          </h1>
          <p className="text-body text-secondary-grey max-w-xl">
            Explore African culture, heritage, craftsmanship, and the 
            inspiration behind every Cilla's Wear collection.
          </p>
        </div>

        {/* Tag Filter Pills */}
        <div className="py-lg border-y border-secondary-grey/20 mb-2xl">
          <Suspense fallback={null}>
            <BlogTagPills />
          </Suspense>
        </div>

        {posts.data.length === 0 ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center 
                       py-3xl space-y-lg border border-secondary-grey/20
                       text-center mb-2xl"
          >
            <p className="text-h3 text-primary-white font-primary">
              No stories found
            </p>
            <p className="text-body text-secondary-grey">
              {params.tag
                ? 'No stories match this tag. Try another.'
                : 'No stories published yet. Check back soon.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2xl mb-2xl">

            {/* Featured Post — first post on page 1 without tag filter */}
            {featuredPost && (
              <FeaturedBlogPost post={featuredPost} />
            )}

            {/* Blog Grid */}
            {remainingPosts.length > 0 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 
                           lg:grid-cols-3 gap-lg"
              >
                {remainingPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Suspense fallback={null}>
              <Pagination
                currentPage={posts.meta.page}
                totalPages={posts.meta.totalPages}
              />
            </Suspense>

          </div>
        )}

      </Container>
    </div>
  )
}
