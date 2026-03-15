import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(function middleware(req) {
  const adminSlug = process.env.ADMIN_SLUG!
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith(`/${adminSlug}`)

  if (isAdminPath) {
    const isLoginPage = pathname === `/${adminSlug}/login`
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')

    if (!req.auth && !isLoginPage) {
      return NextResponse.redirect(new URL(`/${adminSlug}/login`, req.url))
    }
    if (req.auth && isLoginPage) {
      return NextResponse.redirect(new URL(`/${adminSlug}`, req.url))
    }
    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
