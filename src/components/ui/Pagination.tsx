'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Generate page numbers to show
  function getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex items-center justify-center gap-sm mt-2xl"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          'p-sm border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-accent-gold',
          currentPage === 1
            ? 'border-secondary-grey/20 text-secondary-grey/40 cursor-not-allowed'
            : 'border-secondary-grey/40 text-primary-white hover:border-accent-gold hover:text-accent-gold'
        )}
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="text-small text-secondary-grey px-sm"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'w-10 h-10 text-small transition-colors duration-150 border',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-accent-gold',
              page === currentPage
                ? 'bg-accent-gold border-accent-gold text-primary-white'
                : 'border-secondary-grey/40 text-primary-white hover:border-accent-gold hover:text-accent-gold'
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(
          'p-sm border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-accent-gold',
          currentPage === totalPages
            ? 'border-secondary-grey/20 text-secondary-grey/40 cursor-not-allowed'
            : 'border-secondary-grey/40 text-primary-white hover:border-accent-gold hover:text-accent-gold'
        )}
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>
    </nav>
  )
}
