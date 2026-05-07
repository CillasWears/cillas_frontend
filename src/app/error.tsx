'use client'

import { useEffect } from 'react'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-primary-black flex items-center">
      <Container>
        <div className="max-w-lg mx-auto text-center space-y-xl py-3xl">
          <div className="space-y-md">
            <h1 className="text-h1 text-primary-white font-primary">
              Something Went Wrong
            </h1>
            <p className="text-body text-secondary-grey">
              An unexpected error occurred. Please try again or 
              return to the homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-lg">
            <Button
              variant="primary"
              size="lg"
              onClick={reset}
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = '/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
