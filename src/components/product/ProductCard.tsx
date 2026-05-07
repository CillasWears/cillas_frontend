import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { ProductSummary } from '../../types'

interface ProductCardProps {
  product: ProductSummary
  className?: string
}

export default function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const primaryImage = product.images[0]
  const secondaryImage = product.images[1]

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(
        'group block focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent-gold',
        className
      )}
      aria-label={`${product.name} — ₦${product.basePrice.toLocaleString()}`}
    >
      {/* Image Container */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden 
                   bg-secondary-grey/10"
      >
        {primaryImage ? (
          <>
            {/* Primary Image */}
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className={cn(
                'object-cover object-center transition-all duration-300',
                secondaryImage
                  ? 'group-hover:opacity-0'
                  : 'group-hover:scale-105'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Secondary Image (hover swap) */}
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.altText || product.name}
                fill
                className="object-cover object-center opacity-0 
                           transition-opacity duration-300 
                           group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 
                       (max-width: 1024px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          /* Placeholder when no image */
          <div
            className="w-full h-full bg-secondary-grey/10 
                       flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-label text-secondary-grey/40">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-md space-y-xs">
        <h3
          className="text-body text-primary-white font-secondary
                     group-hover:text-accent-gold transition-colors 
                     duration-150 line-clamp-1"
        >
          {product.name}
        </h3>
        <p className="text-small text-secondary-grey">
          ₦{product.basePrice.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}