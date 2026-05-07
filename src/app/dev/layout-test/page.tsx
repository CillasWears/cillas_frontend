import Container from '@/components/layout/Container'

export default function LayoutTestPage() {
  return (
    <div className="min-h-screen pt-3xl">
      <Container>
        <div className="py-2xl space-y-xl">
          <h1 className="text-h1 text-primary-white">Layout Test</h1>
          <p className="text-body text-secondary-grey">
            This page verifies the Container max-width, Navbar, and 
            Footer are all rendering correctly together.
          </p>
          <div className="h-screen flex items-center justify-center 
                          border border-secondary-grey/20">
            <p className="text-body text-secondary-grey">
              Page content area — scroll down to see Footer
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}