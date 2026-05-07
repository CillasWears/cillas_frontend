'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/hooks'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Container from '@/components/layout/Container'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const router = useRouter()
 const { data: user, isLoading } = useMe()

 useEffect(() => {
  if (!isLoading) {
   const token = localStorage.getItem('access_token')
   if (!token) {
    router.replace('/auth/login?callbackUrl=/admin')
    return
   }
   if (user && user.role !== 'ADMIN') {
    router.replace('/account')
   }
  }
 }, [user, isLoading, router])

 if (isLoading) {
  return (
   <div className="min-h-screen bg-primary-black pt-2xl">
    <Container>
     <div className="py-xl flex gap-2xl">
      <div className="w-64 space-y-md hidden lg:block">
       {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
       ))}
      </div>
      <div className="flex-1 space-y-lg">
       <Skeleton className="h-10 w-48" />
       <Skeleton className="h-64 w-full" />
      </div>
     </div>
    </Container>
   </div>
  )
 }

 if (!user || user.role !== 'ADMIN') return null

 return (
  <div className="min-h-screen bg-primary-black pt-2xl">
   <Container>
    <div className="py-xl">

     {/* Page Header */}
     <div className="mb-2xl">
      <p className="text-label text-accent-gold">
       Admin Dashboard
      </p>
      <h1 className="text-h2 text-primary-white font-primary">
       Welcome, {user.firstName}
      </h1>
     </div>

     {/* Layout */}
     <div className="flex flex-col lg:flex-row gap-2xl">
      <AdminSidebar />
      <main className="flex-1 min-w-0">
       {children}
      </main>
     </div>

    </div>
   </Container>
  </div>
 )
}
