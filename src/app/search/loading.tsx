import Container from '@/components/layout/Container'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-primary-black pt-2xl">
      <Container>
        <div className="py-xl space-y-2xl">
          <div className="space-y-sm">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-12 w-64" />
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </Container>
    </div>
  )
}