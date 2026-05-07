'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCategories } from '../../hooks/useProducts'
import { cn } from '../../lib/utils/cn'

export default function CategoryPills() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('categoryId') || ''

  const { data: categories, isLoading } = useCategories()

  function handleCategory(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === currentCategory || categoryId === '') {
      params.delete('categoryId')
    } else {
      params.set('categoryId', categoryId)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex gap-sm flex-wrap py-md">
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

  if (!categories || categories.length === 0) return null

  return (
    <div
      className="flex gap-sm flex-wrap py-md"
      role="group"
      aria-label="Filter by category"
    >
      {/* All Categories pill */}
      <button
        onClick={() => handleCategory('')}
        aria-pressed={currentCategory === ''}
        className={cn(
          'px-md py-sm text-small tracking-wider uppercase',
          'border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-accent-gold',
          currentCategory === ''
            ? 'bg-accent-gold border-accent-gold text-primary-white'
            : 'border-secondary-grey/40 text-secondary-grey hover:border-accent-gold hover:text-accent-gold'
        )}
      >
        All
      </button>

      {/* Category pills */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategory(category.id)}
          aria-pressed={currentCategory === category.id}
          className={cn(
            'px-md py-sm text-small tracking-wider uppercase',
            'border transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-accent-gold',
            currentCategory === category.id
              ? 'bg-accent-gold border-accent-gold text-primary-white'
              : 'border-secondary-grey/40 text-secondary-grey hover:border-accent-gold hover:text-accent-gold'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}