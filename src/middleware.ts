import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
 '/account',
 '/checkout',
 '/orders',
]

const adminRoutes = [
 '/admin',
]

const authRoutes = [
 '/auth/login',
 '/auth/register',
 '/auth/forgot-password',
]

export function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl

 // Check for auth token in localStorage (client-side only)
 // Since middleware runs on the server, we can't access localStorage
 // So we'll let the client-side handle authentication redirects

 const isProtectedRoute = protectedRoutes.some((route) =>
  pathname.startsWith(route)
 )
 const isAdminRoute = adminRoutes.some((route) =>
  pathname.startsWith(route)
 )
 const isAuthRoute = authRoutes.some((route) =>
  pathname.startsWith(route)
 )

 // Allow all routes to pass through
 // Client-side components will handle authentication checks
 return NextResponse.next()
}

export const config = {
 matcher: [
  '/((?!_next/static|_next/image|favicon.ico|images|icons).*)',
 ],
}