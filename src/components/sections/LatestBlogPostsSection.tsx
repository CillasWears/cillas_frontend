import Link from 'next/link'
import Container from '../layout/Container'
import BlogCard from '../blog/BlogCard'
import Button from '../ui/Button'
import { getBlogPosts } from '../../lib/api/blog'
import type { BlogPostSummary } from '../../types'

async function getLatestBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const response = await getBlogPosts({ limit: 3, page: 1 })
    return response.data
  } catch {
    return []
  }
}

export default async function LatestBlogPostsSection() {
  const posts = await getLatestBlogPosts()

  return (
    <section
      className="py-3xl bg-primary-black border-t border-secondary-grey/20"
      aria-labelledby="latest-posts-heading"
    >
      <Container>

        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-end 
                     justify-between gap-lg mb-2xl"
        >
          <div className="space-y-sm">
            <p className="text-label text-accent-gold">From the Journal</p>
            <h2
              id="latest-posts-heading"
              className="text-h2 text-primary-white font-primary"
            >
              Latest Stories
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                       gap-lg"
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-3xl 
                       border border-secondary-grey/20"
          >
            <p className="text-body text-secondary-grey">
              No stories published yet.
            </p>
          </div>
        )}

      </Container>
    </section>
  )
}