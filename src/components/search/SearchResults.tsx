'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SearchResults as SearchResultsType } from '@/types'

interface SearchResultsProps {
  results: SearchResultsType
  query: string
}

export default function SearchResults({
  results,
  query,
}: SearchResultsProps) {
  const hasProducts = results.products.length > 0
  const hasBlogPosts = results.blogPosts.length > 0
  const hasResults = hasProducts || hasBlogPosts

  if (!hasResults) {
    return (
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
        <p className="text-h3 text-primary-white font-primary">
          No results found
        </p>
        <p className="text-body text-secondary-grey">
          No products or stories match{' '}
          <span className="text-primary-white">"{query}"</span>.
          Try a different search term.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3xl">

      {/* Products Section */}
      {hasProducts && (
        <section aria-labelledby="search-products-heading">
          <div
            className="flex items-center justify-between gap-md 
                       mb-xl pb-md border-b border-secondary-grey/20"
          >
            <h2
              id="search-products-heading"
              className="text-h3 text-primary-white font-primary"
            >
              Products
              <span className="text-secondary-grey font-secondary 
                               text-body ml-sm">
                ({results.products.length})
              </span>
            </h2>
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              className="text-small text-accent-gold 
                         hover:text-accent-gold/80 transition-colors 
                         duration-150 focus-visible:outline-none
                         focus-visible:underline"
            >
              View All →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 
                       lg:grid-cols-4 gap-lg"
          >
            {results.products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block focus-visible:outline-none
                           focus-visible:ring-2 
                           focus-visible:ring-accent-gold"
                aria-label={`${product.name} — ₦${product.basePrice.toLocaleString()}`}
              >
                {/* Image */}
                <div
                  className="relative w-full aspect-[3/4] 
                             bg-secondary-grey/10 overflow-hidden mb-md"
                >
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.name}
                      fill
                      className="object-cover object-center 
                                 group-hover:scale-105 
                                 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 
                             (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center 
                                 justify-center"
                      aria-hidden="true"
                    >
                      <span className="text-label text-secondary-grey/40">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-xs">
                  <p
                    className="text-body text-primary-white 
                               group-hover:text-accent-gold 
                               transition-colors duration-150 
                               line-clamp-1"
                  >
                    {product.name}
                  </p>
                  <p className="text-small text-secondary-grey">
                    ₦{product.basePrice.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      {hasBlogPosts && (
        <section aria-labelledby="search-stories-heading">
          <div
            className="flex items-center justify-between gap-md 
                       mb-xl pb-md border-b border-secondary-grey/20"
          >
            <h2
              id="search-stories-heading"
              className="text-h3 text-primary-white font-primary"
            >
              Stories
              <span className="text-secondary-grey font-secondary 
                               text-body ml-sm">
                ({results.blogPosts.length})
              </span>
            </h2>
            <Link
              href="/blog"
              className="text-small text-accent-gold 
                         hover:text-accent-gold/80 transition-colors 
                         duration-150 focus-visible:outline-none
                         focus-visible:underline"
            >
              View All →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 
                       lg:grid-cols-3 gap-lg"
          >
            {results.blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block space-y-md p-lg border 
                           border-secondary-grey/20
                           hover:border-accent-gold 
                           transition-all duration-150
                           focus-visible:outline-none
                           focus-visible:ring-2 
                           focus-visible:ring-accent-gold"
                aria-label={post.title}
              >
                <h3
                  className="text-h3 text-primary-white font-primary
                             group-hover:text-accent-gold 
                             transition-colors duration-150 line-clamp-2"
                >
                  {post.title}
                </h3>
                <p
                  className="text-body text-secondary-grey line-clamp-2"
                >
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
