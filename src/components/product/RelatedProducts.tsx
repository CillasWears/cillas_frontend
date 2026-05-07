import Link from 'next/link'
import Container from '@/components/layout/Container'
import ProductCard from '@/components/product/ProductCard'
import { getProducts } from '@/lib/api'
import type { ProductSummary } from '@/types'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
): Promise<ProductSummary[]> {
  try {
    const response = await getProducts({
      categoryId,
      limit: 5,
      page: 1,
    })
    // Exclude current product from results
    return response.data
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4)
  } catch {
    return []
  }
}

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId)

  if (products.length === 0) return null

  return (
    <section
      className="py-3xl border-t border-secondary-grey/20"
      aria-labelledby="related-products-heading"
    >
      <Container>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start 
                        sm:items-end justify-between gap-lg mb-2xl">
          <div className="space-y-sm">
            <p className="text-label text-accent-gold">
              You May Also Like
            </p>
            <h2
              id="related-products-heading"
              className="text-h2 text-primary-white font-primary"
            >
              Related Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-small text-secondary-grey 
                       hover:text-accent-gold transition-colors duration-150
                       focus-visible:outline-none focus-visible:text-accent-gold"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 
                     lg:grid-cols-4 gap-lg"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </Container>
    </section>
  )
}