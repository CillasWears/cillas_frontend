import Link from 'next/link'
import Container from '../layout/Container'
import ProductCard from '../product/ProductCard'
import Button from '../ui/Button'
import { getProducts } from '../../lib/api/products'
import type { ProductSummary } from '../../types'

async function getFeaturedProducts(): Promise<ProductSummary[]> {
  try {
    const response = await getProducts({ limit: 4, page: 1 })
    return response.data
  } catch {
    return []
  }
}

export default async function FeaturedProductsSection() {
  const products = await getFeaturedProducts()

  return (
    <section
      className="py-3xl bg-primary-black"
      aria-labelledby="featured-products-heading"
    >
      <Container>

        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-end 
                     justify-between gap-lg mb-2xl"
        >
          <div className="space-y-sm">
            <p className="text-label text-accent-gold">New Arrivals</p>
            <h2
              id="featured-products-heading"
              className="text-h2 text-primary-white font-primary"
            >
              Featured Collection
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                       gap-lg"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-3xl 
                       border border-secondary-grey/20"
          >
            <p className="text-body text-secondary-grey">
              No products available yet.
            </p>
          </div>
        )}

      </Container>
    </section>
  )
}