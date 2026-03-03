import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(req: NextRequest) {
  const adminSlug = process.env.ADMIN_SLUG!
  const { pathname } = req.nextUrl

  const isAdminPath = pathname.startsWith(`/${adminSlug}`)

  if (isAdminPath) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')

    const session = await auth()
    if (!session) {
      return NextResponse.rewrite(new URL('/not-found', req.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
