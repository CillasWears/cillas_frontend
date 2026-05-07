import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primary-black flex items-center">
      <Container>
        <div
          className="max-w-lg mx-auto text-center space-y-xl py-3xl"
        >
          {/* 404 */}
          <p
            className="font-primary text-primary-white"
            style={{ fontSize: '120px', lineHeight: '1', 
                     opacity: 0.1 }}
            aria-hidden="true"
          >
            404
          </p>

          <div className="space-y-md -mt-xl">
            <h1 className="text-h1 text-primary-white font-primary">
              Page Not Found
            </h1>
            <p className="text-body text-secondary-grey">
              The page you are looking for does not exist or has 
              been moved.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center 
                       justify-center gap-lg"
          >
            <Link href="/">
              <Button variant="primary" size="lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}