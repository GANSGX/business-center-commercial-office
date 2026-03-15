import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(function middleware(req) {
  const adminSlug = process.env.ADMIN_SLUG!
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith(`/${adminSlug}`)

  if (isAdminPath) {
    // TODO Sprint 3: раскомментировать после подключения NextAuth + БД
    // if (!req.auth) {
    //   return NextResponse.rewrite(new URL('/not-found', req.url))
    // }
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
