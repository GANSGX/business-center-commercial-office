import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, visitorId } = await req.json()

    if (!path || !visitorId || typeof path !== 'string' || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') ?? ''
    const device = /mobile|android|iphone|ipad|tablet/i.test(ua) ? 'mobile' : 'desktop'

    await prisma.pageView.create({
      data: {
        path: path.slice(0, 500),
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        device,
        visitorId: visitorId.slice(0, 64),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
