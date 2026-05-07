import Image from 'next/image'
import Link from 'next/link'
import {cn } from '@/lib/utils/cn'
import Badge from '../ui/Badge'
import type { BlogPostSummary } from '../../types'

interface BlogCardProps {
  post: BlogPostSummary
  className?: string
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent-gold',
        className
      )}
      aria-label={post.title}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-video overflow-hidden 
                   bg-secondary-grey/10"
      >
        <div
          className="w-full h-full bg-secondary-grey/10 
                     flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-label text-secondary-grey/40">
            No Image
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-md space-y-sm">

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-sm">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                label={tag.name}
                variant="outline"
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className="text-h3 text-primary-white font-primary
                     group-hover:text-accent-gold transition-colors 
                     duration-150 line-clamp-2"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-body text-secondary-grey line-clamp-2">
          {post.excerpt}
        </p>

        {/* Date */}
        <p className="text-small text-secondary-grey/60">
          {formatDate(post.createdAt)}
        </p>

      </div>
    </Link>
  )
}