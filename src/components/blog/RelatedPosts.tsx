import Link from 'next/link'
import BlogCard from './BlogCard'
import Container from '../layout/Container'
import { getBlogPosts } from '@/lib/api/blog'
import type { BlogPostSummary } from '@/types'

interface RelatedPostsProps {
  currentPostId: string
  tagSlug: string
  tagName: string
}

async function getRelatedPosts(
  currentPostId: string,
  tagSlug: string
): Promise<BlogPostSummary[]> {
  try {
    const response = await getBlogPosts({
      tag: tagSlug,
      limit: 4,
      page: 1,
    })
    return response.data
      .filter((p) => p.id !== currentPostId)
      .slice(0, 3)
  } catch {
    return []
  }
}

export default async function RelatedPosts({
  currentPostId,
  tagSlug,
  tagName,
}: RelatedPostsProps) {
  const posts = await getRelatedPosts(currentPostId, tagSlug)

  if (posts.length === 0) return null

  return (
    <section
      className="py-3xl border-t border-secondary-grey/20"
      aria-labelledby="related-posts-heading"
    >
      <Container>

        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row items-start 
                     sm:items-end justify-between gap-lg mb-2xl"
        >
          <div className="space-y-sm">
            <p className="text-label text-accent-gold">
              More Stories
            </p>
            <h2
              id="related-posts-heading"
              className="text-h2 text-primary-white font-primary"
            >
              Related to {tagName}
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-small text-secondary-grey 
                       hover:text-accent-gold transition-colors 
                       duration-150 focus-visible:outline-none
                       focus-visible:text-accent-gold"
          >
            View All Stories →
          </Link>
        </div>

        {/* Posts Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 
                     lg:grid-cols-3 gap-lg"
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

      </Container>
    </section>
  )
}
