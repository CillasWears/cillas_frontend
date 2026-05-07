import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { BlogPostSummary } from '@/types'

interface FeaturedBlogPostProps {
  post: BlogPostSummary
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function FeaturedBlogPost({ post }: FeaturedBlogPostProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-accent-gold"
      aria-label={`Featured: ${post.title}`}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-2xl 
                   border border-secondary-grey/20 p-xl
                   hover:border-accent-gold transition-all duration-300"
      >
        {/* Image Placeholder */}
        <div
          className="relative w-full aspect-video bg-secondary-grey/10
                     flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span className="text-label text-secondary-grey/40">
            Featured Image
          </span>
          <div
            className="absolute inset-0 bg-accent-gold/5 
                       group-hover:bg-accent-gold/10 
                       transition-colors duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-lg">

          {/* Featured Label */}
          <p className="text-label text-accent-gold">
            Featured Story
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-sm">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  label={tag.name}
                  variant="outline"
                />
              ))}
            </div>
          )}

          {/* Title */}
          <h2
            className="text-h2 text-primary-white font-primary
                       group-hover:text-accent-gold transition-colors 
                       duration-150"
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-body text-secondary-grey line-clamp-3">
            {post.excerpt}
          </p>

          {/* Date + Read More */}
          <div
            className="flex items-center justify-between gap-md 
                       flex-wrap"
          >
            <p className="text-small text-secondary-grey/60">
              {formatDate(post.createdAt)}
            </p>
            <span
              className="text-small text-accent-gold tracking-wider 
                         uppercase group-hover:underline"
            >
              Read Story →
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}
