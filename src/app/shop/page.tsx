import type { Metadata } from 'next'
import { Suspense } from 'react'
import Container from '@/components/layout/Container'
import ProductCard from '@/components/product/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import Pagination from '@/components/ui/Pagination'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { getProducts } from '@/lib/api'

export const metadata: Metadata = {
  title: "Shop — Cilla's Wears",
  description:
    "Browse the full Cilla's Wears collection. Premium urban-African fashion for the modern African.",
  openGraph: {
    title: "Shop — Cilla's Wears",
    description:
      "Browse the full Cilla's Wears collection. Premium urban-African fashion.",
  },
}

export const revalidate = 3600

interface ShopPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    categoryId?: string
    sortBy?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 12

  let products = {
    data: [] as Awaited<ReturnType<typeof getProducts>>['data'],
    meta: { total: 0, page: 1, limit, totalPages: 0 },
  }

  try {
    products = await getProducts({
      page,
      limit,
      search: params.search,
      categoryId: params.categoryId,
      sortBy: params.sortBy,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    })
  } catch {
    // Empty state handled below
  }

  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>

        {/* Page Header */}
        <div className="py-xl space-y-sm">
          <h1 className="text-h1 text-primary-white font-primary">
            Shop
          </h1>
          <p className="text-body text-secondary-grey">
            {products.meta.total > 0
              ? `${products.meta.total} pieces`
              : 'Explore our collection'}
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={null}>
          <ShopFilters />
        </Suspense>

        {/* Product Grid */}
        <div className="py-2xl">
          {products.data.length > 0 ? (
            <>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 
                           lg:grid-cols-3 xl:grid-cols-4 gap-lg"
              >
                {products.data.map((product: Awaited<ReturnType<typeof getProducts>>['data'][number]) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Suspense fallback={null}>
                <Pagination
                  currentPage={products.meta.page}
                  totalPages={products.meta.totalPages}
                />
              </Suspense>
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center 
                         py-3xl space-y-lg border border-secondary-grey/20"
            >
              <p className="text-h3 text-primary-white font-primary">
                No products found
              </p>
              <p className="text-body text-secondary-grey">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>

      </Container>
    </div>
  )
}
