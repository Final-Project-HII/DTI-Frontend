import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

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
    '/admin/warehouse',
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
  const cookieStore = cookies()
  const Sid = cookieStore.get('Sid')

  const publicRoutes = [
    '/',
    '/reset-password',
    '/reset-password-confirmation',
    '/manage-password',
    '/product',
  ]

  const authRoutes = ['/login', '/register']

  if (
    (role === 'ADMIN' || role === 'SUPER') &&
    (path === '/' || path.startsWith('/product'))
  ) {
    const redirectUrl = new URL('/admin/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (req.auth && authRoutes.includes(path)) {
    const redirectUrl = new URL('/', req.url)
    redirectUrl.searchParams.set(
      'modalInfo',
      JSON.stringify({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        redirectTo: '/',
      })
    )
    return NextResponse.redirect(redirectUrl)
  }

  if (
    publicRoutes.includes(path) ||
    path.startsWith('/product') ||
    authRoutes.includes(path)
  ) {
    return NextResponse.next()
  }

  if (!req.auth && Sid) {
    const redirectUrl = new URL('/', req.url)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.delete('Sid')
    return response
  }

  if (!req.auth) {
    const baseUrl = new URL('/', req.url)
    baseUrl.searchParams.set(
      'modalInfo',
      JSON.stringify({
        title: 'Login Required',
        description: 'Please log in to access this page.',
        redirectTo: '/',
      })
    )
    return NextResponse.redirect(baseUrl)
  }

  if (role === 'ADMIN') {
    if (!adminRoutes.includes(path)) {
      const redirectUrl = new URL('/admin/dashboard', req.url)
      redirectUrl.searchParams.set(
        'modalInfo',
        JSON.stringify({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          redirectTo: '/admin/dashboard',
        })
      )
      return NextResponse.redirect(redirectUrl)
    }
  } else if (role === 'SUPER') {
    if (!superAdminRoutes.includes(path)) {
      const redirectUrl = new URL('/admin/dashboard', req.url)
      redirectUrl.searchParams.set(
        'modalInfo',
        JSON.stringify({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          redirectTo: '/admin/dashboard',
        })
      )
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (role === 'USER') {
    if (!userRoutes.includes(path)) {
      const redirectUrl = new URL('/', req.url)
      redirectUrl.searchParams.set(
        'modalInfo',
        JSON.stringify({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          redirectTo: '/',
        })
      )
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
})
