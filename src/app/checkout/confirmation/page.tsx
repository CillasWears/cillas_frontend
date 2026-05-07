import { Suspense } from 'react'
import OrderConfirmationPageWrapper from './OrderConfirmationPage'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-black" />}>
      <OrderConfirmationPageWrapper />
    </Suspense>
  )
}
