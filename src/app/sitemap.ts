import { MetadataRoute } from 'next'
import { getProducts, getBlogPosts } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'

 // Static routes
 const staticRoutes: MetadataRoute.Sitemap = [
  {
   url: baseUrl,
   lastModified: new Date(),
   changeFrequency: 'daily',
   priority: 1,
  },
  {
   url: `${baseUrl}/shop`,
   lastModified: new Date(),
   changeFrequency: 'daily',
   priority: 0.9,
  },
  {
   url: `${baseUrl}/blog`,
   lastModified: new Date(),
   changeFrequency: 'daily',
   priority: 0.8,
  },
  {
   url: `${baseUrl}/search`,
   lastModified: new Date(),
   changeFrequency: 'weekly',
   priority: 0.5,
  },
 ]

 // Dynamic product routes
 let productRoutes: MetadataRoute.Sitemap = []
 try {
  const products = await getProducts({ limit: 100 })
  productRoutes = products.data.map((product) => ({
   url: `${baseUrl}/shop/${product.slug}`,
   lastModified: new Date(),
   changeFrequency: 'weekly' as const,
   priority: 0.8,
  }))
 } catch {
  // Continue without product routes
 }

 // Dynamic blog routes
 let blogRoutes: MetadataRoute.Sitemap = []
 try {
  const posts = await getBlogPosts({ limit: 100 })
  blogRoutes = posts.data.map((post) => ({
   url: `${baseUrl}/blog/${post.slug}`,
   lastModified: new Date(post.createdAt),
   changeFrequency: 'monthly' as const,
   priority: 0.7,
  }))
 } catch {
  // Continue without blog routes
 }

 return [...staticRoutes, ...productRoutes, ...blogRoutes]
}