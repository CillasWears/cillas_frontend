'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, Suspense } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import CategoryPills from './CategoryPills'

const SORT_OPTIONS = [
 { label: 'Newest', value: 'newest' },
 { label: 'Price: Low to High', value: 'price_asc' },
 { label: 'Price: High to Low', value: 'price_desc' },
]

const PRICE_RANGES = [
 { label: 'All Prices', min: undefined, max: undefined },
 { label: 'Under ₦10,000', min: undefined, max: 10000 },
 { label: '₦10,000 – ₦50,000', min: 10000, max: 50000 },
 { label: '₦50,000 – ₦100,000', min: 50000, max: 100000 },
 { label: 'Above ₦100,000', min: 100000, max: undefined },
]

export default function ShopFilters() {
 const router = useRouter()
 const pathname = usePathname()
 const searchParams = useSearchParams()

 const currentSearch = searchParams.get('search') || ''
 const currentSort = searchParams.get('sortBy') || ''
 const currentMin = searchParams.get('minPrice') || ''
 const currentMax = searchParams.get('maxPrice') || ''

 const updateParams = useCallback(
  (updates: Record<string, string | undefined>) => {
   const params = new URLSearchParams(searchParams.toString())

   Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === '') {
     params.delete(key)
    } else {
     params.set(key, value)
    }
   })

   params.set('page', '1')
   router.push(`${pathname}?${params.toString()}`)
  },
  [router, pathname, searchParams]
 )

 function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
  updateParams({ search: e.target.value || undefined })
 }

 function handleSort(value: string) {
  updateParams({ sortBy: value || undefined })
 }

 function handlePriceRange(min?: number, max?: number) {
  updateParams({
   minPrice: min?.toString(),
   maxPrice: max?.toString(),
  })
 }

 function clearFilters() {
  router.push(pathname)
 }

 const hasActiveFilters = currentSearch || currentSort || currentMin || currentMax

 return (
  <div className="space-y-sm">
   <Suspense fallback={null}>
    <CategoryPills />
   </Suspense>

   <div
    className="flex flex-col lg:flex-row gap-md items-start 
              lg:items-center py-lg border-y border-secondary-grey/20"
   >
    <div className="relative flex-1 max-w-sm">
     <Search
      size={16}
      strokeWidth={1.5}
      className="absolute left-md top-1/2 -translate-y-1/2 
              text-secondary-grey pointer-events-none"
      aria-hidden="true"
     />
     <input
      type="search"
      placeholder="Search products..."
      value={currentSearch}
      onChange={handleSearch}
      aria-label="Search products"
      className="w-full bg-transparent border border-secondary-grey/40
              text-primary-white text-body pl-2xl pr-md py-sm
              placeholder:text-secondary-grey/60
              hover:border-secondary-grey focus:outline-none 
              focus:border-accent-gold transition-colors duration-150"
     />
    </div>

    <select
     value={`${currentMin}-${currentMax}`}
     onChange={(e) => {
      const selected = PRICE_RANGES.find(
       (r) => `${r.min ?? ''}-${r.max ?? ''}` === e.target.value
      )
      if (selected) {
       handlePriceRange(selected.min, selected.max)
      }
     }}
     aria-label="Filter by price range"
     className="bg-primary-black border border-secondary-grey/40
            text-primary-white text-small px-md py-sm
            hover:border-secondary-grey focus:outline-none
            focus:border-accent-gold transition-colors duration-150
            cursor-pointer"
    >
     {PRICE_RANGES.map((range) => (
      <option
       key={`${range.min}-${range.max}`}
       value={`${range.min ?? ''}-${range.max ?? ''}`}
      >
       {range.label}
      </option>
     ))}
    </select>

    <select
     value={currentSort}
     onChange={(e) => handleSort(e.target.value)}
     aria-label="Sort products"
     className="bg-primary-black border border-secondary-grey/40
            text-primary-white text-small px-md py-sm
            hover:border-secondary-grey focus:outline-none
            focus:border-accent-gold transition-colors duration-150
            cursor-pointer"
    >
     <option value="">Sort By</option>
     {SORT_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
       {option.label}
      </option>
     ))}
    </select>

    {hasActiveFilters && (
     <button
      onClick={clearFilters}
      className={cn(
       'flex items-center gap-sm text-small',
       'text-secondary-grey hover:text-accent-gold',
       'transition-colors duration-150',
       'focus-visible:outline-none focus-visible:text-accent-gold'
      )}
      aria-label="Clear all filters"
     >
      <X size={14} strokeWidth={1.5} aria-hidden="true" />
      Clear Filters
     </button>
    )}
   </div>
  </div>
 )
}