import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/cartdetail',
    '/admin/dashboard',
    '/admin/product',
    '/admin/category',
    '/admin/admin-management',
    '/admin/stock/management',
    '/admin/stock/request',
    '/admin/stock/approval',
    '/admin/transaction/order',
    '/reset-password',
    '/reset-password-confirmation',
    '/manage-password',
    '/checkout',
    '/profile',
    '/managepayment',
    '/order',
    '/product',
    '/product/:path*',
  ],
}

const adminRoutes = [
  '/admin/dashboard',
  '/admin/product',
  '/admin/category',
  '/admin/stock/management',
  '/admin/stock/request',
  '/admin/stock/approval',
  '/admin/transaction/order',
]

const userRoutes = [
  '/cartdetail',
  '/checkout',
  '/profile',
  '/managepayment',
  '/order',
  '/',
  '/product',
]

const superAdminRoutes = [
  '/admin/dashboard',
  '/admin/product',
  '/admin/category',
  '/admin/stock/management',
  '/admin/stock/request',
  '/admin/stock/approval',
  '/admin/transaction/order',
  '/admin/warehouse',
  '/admin/admin-management',
]

export default auth((req: any) => {
  const reqUrl = new URL(req.url)
  const path = reqUrl.pathname
  const role = req.auth?.user.role

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/reset-password-confirmation',
    '/manage-password',
    '/product',
  ]

  if (
    (role === 'ADMIN' || role === 'SUPER') &&
    (path === '/' || path.startsWith('/product'))
  ) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  if (publicRoutes.includes(path) || path.startsWith('/product')) {
    return NextResponse.next()
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Handle admin routes access
  if (role === 'ADMIN') {
    if (!adminRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  } else if (role === 'SUPER') {
    if (!superAdminRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  if (role === 'USER') {
    if (!userRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // For other authenticated routes
  return NextResponse.next()
})
