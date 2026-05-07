'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useBlogTags } from '@/hooks'
import { cn } from '@/lib/utils/cn'

export default function BlogTagPills() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get('tag') || ''

  const { data: tags, isLoading } = useBlogTags()

  function handleTag(tagSlug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tagSlug === currentTag || tagSlug === '') {
      params.delete('tag')
    } else {
      params.set('tag', tagSlug)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex gap-sm flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-secondary-grey/10 animate-pulse 
                       rounded-sm"
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }

  if (!tags || tags.length === 0) return null

  return (
    <div
      className="flex gap-sm flex-wrap"
      role="group"
      aria-label="Filter by tag"
    >
      {/* All Posts pill */}
      <button
        onClick={() => handleTag('')}
        aria-pressed={currentTag === ''}
        className={cn(
          'px-md py-sm text-small tracking-wider uppercase',
          'border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-accent-gold',
          currentTag === ''
            ? 'bg-accent-gold border-accent-gold text-primary-white'
            : 'border-secondary-grey/40 text-secondary-grey hover:border-accent-gold hover:text-accent-gold'
        )}
      >
        All
      </button>

      {/* Tag Pills */}
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTag(tag.slug || tag.name.toLowerCase())}
          aria-pressed={currentTag === (tag.slug || tag.name.toLowerCase())}
          className={cn(
            'px-md py-sm text-small tracking-wider uppercase',
            'border transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-accent-gold',
            currentTag === (tag.slug || tag.name.toLowerCase())
              ? 'bg-accent-gold border-accent-gold text-primary-white'
              : 'border-secondary-grey/40 text-secondary-grey hover:border-accent-gold hover:text-accent-gold'
          )}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
