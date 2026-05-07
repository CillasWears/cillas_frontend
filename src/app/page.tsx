import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import BrandStorySection from '@/components/sections/BrandStorySection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import LatestBlogPostsSection from '@/components/sections/LatestBlogPostsSection'

export const metadata: Metadata = {
  title: "Cilla's Wear — Premium Urban-African Fashion",
  description:
    "Discover premium urban-African fashion at Cilla's Wear. Bold, minimal, and deeply cultural clothing crafted for the modern African.",
  openGraph: {
    title: "Cilla's Wear — Premium Urban-African Fashion",
    description:
      "Discover premium urban-African fashion at Cilla's Wear. Bold, minimal, and deeply cultural clothing crafted for the modern African.",
    type: 'website',
  },
}

// Static rendering with revalidation every 1 hour
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStorySection />
      <FeaturedProductsSection />
      <LatestBlogPostsSection />
    </>
  )
}
