import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductActions from '@/components/product/ProductActions'
import { getProductBySlug, getProducts } from '@/lib/api'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params  
    const product = await getProductBySlug(slug)
    return {
      title: `${product.name} — Cilla's Wear`,
      description: product.description,
      openGraph: {
        title: `${product.name} — Cilla's Wear`,
        description: product.description,
        images: product.images[0]
          ? [{ url: product.images[0].url, alt: product.images[0].altText }]
          : [],
      },
    }
  } catch {
    return { title: "Product — Cilla's Wear" }
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts({ limit: 50 })
    return products.data.map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 3600

export default async function ProductPage({ params }: ProductPageProps) {
  let product

  try {
    const { slug } = await params 
    console.log('Looking for slug:', slug) 
    product = await getProductBySlug(slug)  
    console.log('Found product:', product.name)
  } catch {
    console.error('Product not found for slug:')
    notFound()
  }

  const hasVariants = product.variants.length > 0
  const basePrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((v: { price: number }) => v.price))
      : product.basePrice

  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="py-xl">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-sm mb-2xl"
            aria-label="Breadcrumb"
          >
            <a
              href="/shop"
              className="text-small text-secondary-grey hover:text-accent-gold transition-colors duration-150"
            >
              Shop
            </a>
            <span
              className="text-small text-secondary-grey/40"
              aria-hidden="true"
            >
              /
            </span>
            <span className="text-small text-primary-white">
              {product.name}
            </span>
          </nav>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl">

            {/* Left — Image Gallery */}
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />

            {/* Right — Product Info */}
            <div className="space-y-xl">

              {/* Category */}
              {product.category && (
                <p className="text-label text-accent-gold">
                  {product.category.name}
                </p>
              )}

              {/* Name */}
              <h1 className="text-h1 text-primary-white font-primary">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-h3 text-primary-white font-secondary">
                ₦{basePrice.toLocaleString()}
              </p>

              {/* Divider */}
              <div
                className="w-full h-px bg-secondary-grey/20"
                aria-hidden="true"
              />

              {/* Variant Selector + Add to Cart — client component */}
              <ProductActions
                variants={product.variants}
                productId={product.id}
                hasVariants={hasVariants}
              />

              {/* Description */}
              <div className="space-y-sm">
                <h2 className="text-label text-primary-white">
                  Description
                </h2>
                <p className="text-body text-secondary-grey leading-relaxed">
                  {product.description}
                </p>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
