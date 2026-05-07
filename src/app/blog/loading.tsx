import Container from '@/components/layout/Container'
import { BlogGridSkeleton } from '@/components/ui/Skeleton'
import { Skeleton } from '@/components/ui/Skeleton'

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="py-xl space-y-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="py-lg border-y border-secondary-grey/20 mb-2xl">
          <div className="flex gap-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
        <BlogGridSkeleton count={9} />
      </Container>
    </div>
  )
}