import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 1 [S1-D2-02]: GET — одно помещение по slug, 404 если не найдено
// TODO Sprint 2 [S2-D2-01]: убедиться что возвращает photos[] sorted by order
// TODO Sprint 3 [S3-D2-01]: PUT, DELETE — admin only
export function GET(_req: NextRequest, _ctx: { params: Promise<{ slug: string }> }) {
  return NextResponse.json({})
}
