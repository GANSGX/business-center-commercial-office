import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)
const PUBLIC_SINGLE_SEGMENT_ROUTES = new Set([
  '404',
  'about',
  'contacts',
  'gallery',
  'in-building',
  'location',
  'login',
  'offices',
  'privacy',
  'robots.txt',
  'services',
  'sitemap.xml',
])

const ADMIN_SECTION_ROUTES = new Set([
  'analytics',
  'building-orgs',
  'gallery',
  'hero-slides',
  'leads',
  'login',
  'rooms',
  'services',
  'settings',
  'tenant-requests',
])

export default auth(function middleware(req) {
  const adminSlug = process.env.ADMIN_SLUG!
  const { pathname } = req.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  const secondSegment = segments[1]
  const isAdminPath = pathname.startsWith(`/${adminSlug}`)

  // Prevent dynamic [adminSlug] from accepting arbitrary slugs.
  if (firstSegment && firstSegment !== adminSlug) {
    if (segments.length === 1 && !PUBLIC_SINGLE_SEGMENT_ROUTES.has(firstSegment)) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (firstSegment !== 'api' && secondSegment && ADMIN_SECTION_ROUTES.has(secondSegment)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

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
