'use client'

import { useState } from 'react'
import Image from 'next/image'
import{ cn }from '@/lib/utils/cn'
import type { ProductImage } from '@/types'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div
        className="w-full aspect-[3/4] bg-secondary-grey/10 
                   flex items-center justify-center"
        aria-label="No product images available"
      >
        <span className="text-label text-secondary-grey/40">
          No Images
        </span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div className="flex flex-col-reverse md:flex-row gap-md">

      {/* Thumbnail Strip — left side on desktop, bottom on mobile */}
      <div
        className="flex flex-row md:flex-col gap-sm overflow-x-auto 
                   md:overflow-y-auto md:max-h-[600px] md:w-20 
                   scrollbar-hide"
        role="tablist"
        aria-label="Product image thumbnails"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View image ${index + 1} of ${images.length}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20',
              'overflow-hidden border-2 transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-accent-gold',
              index === activeIndex
                ? 'border-accent-gold'
                : 'border-transparent hover:border-secondary-grey'
            )}
          >
            <Image
              src={image.url}
              alt={image.altText || `${productName} image ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="relative flex-1 aspect-[3/4] overflow-hidden 
                   bg-secondary-grey/10"
        role="tabpanel"
        aria-label={activeImage.altText || productName}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.altText || productName}
          fill
          priority
          quality={90}
          className="object-cover object-center transition-opacity 
                     duration-300"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

    </div>
  )
}