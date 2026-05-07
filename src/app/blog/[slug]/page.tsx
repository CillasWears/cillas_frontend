import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Badge from '@/components/ui/Badge'
import BlogPostContent from '@/components/blog/BlogPostContent'
import SocialShare from '@/components/blog/SocialShare'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/api/blog'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params

  try {
    const post = await getBlogPostBySlug(resolvedParams.slug)
    return {
      title: `${post.title} — Cilla's Wear`,
      description: post.excerpt,
      openGraph: {
        title: `${post.title} — Cilla's Wear`,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.createdAt,
      },
    }
  } catch {
    return { title: "Story — Cilla's Wear" }
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts({ limit: 50 })
    return posts.data.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 3600

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  let post

  try {
    post = await getBlogPostBySlug(resolvedParams.slug)
  } catch {
    notFound()
  }

  // Use first tag for related posts
  const primaryTag = post.tags[0] || null

  return (
    <>
      <div className="min-h-screen bg-primary-black pt-2xl">
        <Container>
          <article className="py-xl max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-sm mb-2xl"
              aria-label="Breadcrumb"
            >
              <Link
                href="/blog"
                className="text-small text-secondary-grey 
                           hover:text-accent-gold transition-colors 
                           duration-150"
              >
                Stories
              </Link>
              <span
                className="text-small text-secondary-grey/40"
                aria-hidden="true"
              >
                /
              </span>
              <span className="text-small text-primary-white line-clamp-1">
                {post.title}
              </span>
            </nav>

            {/* Post Header */}
            <header className="space-y-xl mb-2xl">

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-sm">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug || tag.name.toLowerCase()}`}
                      className="focus-visible:outline-none 
                                 focus-visible:ring-2 
                                 focus-visible:ring-accent-gold"
                    >
                      <Badge
                        label={tag.name}
                        variant="outline"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-h1 text-primary-white font-primary">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-h3 text-secondary-grey font-secondary
                            font-normal leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div
                className="flex items-center justify-between gap-md 
                           flex-wrap py-lg border-y border-secondary-grey/20"
              >
                <p className="text-small text-secondary-grey">
                  {formatDate(post.createdAt)}
                </p>
                <SocialShare title={post.title} slug={post.slug} />
              </div>

            </header>

            {/* Featured Image Placeholder */}
            <div
              className="w-full aspect-video bg-secondary-grey/10 
                         flex items-center justify-center mb-2xl"
              aria-hidden="true"
            >
              <span className="text-label text-secondary-grey/40">
                Featured Image
              </span>
            </div>

            {/* Post Content */}
            <BlogPostContent content={post.content} />

            {/* Footer */}
            <footer className="mt-2xl pt-xl border-t border-secondary-grey/20 
                               space-y-lg">

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-sm">
                  <p className="text-label text-secondary-grey">Tags:</p>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug || tag.name.toLowerCase()}`}
                      className="focus-visible:outline-none 
                                 focus-visible:ring-2 
                                 focus-visible:ring-accent-gold"
                    >
                      <Badge label={tag.name} variant="outline" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Share */}
              <SocialShare title={post.title} slug={post.slug} />

              {/* Back to Blog */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-sm text-small 
                           text-secondary-grey hover:text-accent-gold 
                           transition-colors duration-150
                           focus-visible:outline-none 
                           focus-visible:text-accent-gold"
              >
                ← Back to Stories
              </Link>

            </footer>

          </article>
        </Container>
      </div>

      {/* Related Posts — outside container for section feel */}
      {primaryTag && (
        <RelatedPosts
          currentPostId={post.id}
          tagSlug={primaryTag.slug || primaryTag.name.toLowerCase()}
          tagName={primaryTag.name}
        />
      )}
    </>
  )
}
