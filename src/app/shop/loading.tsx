import Container from '@/components/layout/Container'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="py-xl space-y-sm">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="py-lg border-y border-secondary-grey/20 mb-2xl">
          <div className="flex gap-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
        <ProductGridSkeleton count={12} />
      </Container>
    </div>
  )
}