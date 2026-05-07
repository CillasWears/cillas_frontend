'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Container from '@/components/layout/Container'
import SearchInput from '@/components/search/SearchInput'
import SearchResults from '@/components/search/SearchResults'
import { ProductGridSkeleton, BlogGridSkeleton } from '@/components/ui/Skeleton'
import { useSearch } from '@/hooks'
import { useDebounce } from '@/hooks'
import { Search } from 'lucide-react'

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [inputValue, setInputValue] = useState(initialQuery)
  const debouncedQuery = useDebounce(inputValue, 300)

  const {
    data: results,
    isLoading,
    isFetching,
  } = useSearch(debouncedQuery)

  // Sync query to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    }
    const newUrl = debouncedQuery
      ? `/search?${params.toString()}`
      : '/search'
    router.replace(newUrl, { scroll: false })
  }, [debouncedQuery, router])

  const showLoading = (isLoading || isFetching) && 
                      debouncedQuery.length >= 2
  const showResults = results && debouncedQuery.length >= 2
  const showEmpty = !isLoading && !results && 
                    debouncedQuery.length >= 2

  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="py-xl space-y-2xl">

          {/* Page Header */}
          <div className="space-y-sm">
            <p className="text-label text-accent-gold">Search</p>
            <h1 className="text-h1 text-primary-white font-primary">
              Find Your Piece
            </h1>
          </div>

          {/* Search Input */}
          <SearchInput
            value={inputValue}
            onChange={setInputValue}
            autoFocus
          />

          {/* Results Area */}
          <div className="pb-3xl">

            {/* Initial State — no query */}
            {debouncedQuery.length < 2 && (
              <div
                className="flex flex-col items-center justify-center 
                           py-3xl space-y-lg text-center"
              >
                <Search
                  size={48}
                  strokeWidth={1}
                  className="text-secondary-grey/40"
                  aria-hidden="true"
                />
                <p className="text-body text-secondary-grey">
                  Type at least 2 characters to search products 
                  and stories
                </p>
              </div>
            )}

            {/* Loading State */}
            {showLoading && (
              <div className="space-y-3xl">
                <div className="space-y-xl">
                  <div
                    className="h-px w-full bg-secondary-grey/20"
                    aria-hidden="true"
                  />
                  <ProductGridSkeleton count={4} />
                </div>
                <div className="space-y-xl">
                  <div
                    className="h-px w-full bg-secondary-grey/20"
                    aria-hidden="true"
                  />
                  <BlogGridSkeleton count={3} />
                </div>
              </div>
            )}

            {/* Results */}
            {!showLoading && showResults && (
              <SearchResults
                results={results}
                query={debouncedQuery}
              />
            )}

          </div>
        </div>
      </Container>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-black pt-2xl">
        <Container>
          <div className="py-xl space-y-2xl">
            <div className="space-y-sm">
              <p className="text-label text-accent-gold">Search</p>
              <h1 className="text-h1 text-primary-white font-primary">
                Find Your Piece
              </h1>
            </div>
            <div className="space-y-3xl">
              <ProductGridSkeleton count={4} />
            </div>
          </div>
        </Container>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
