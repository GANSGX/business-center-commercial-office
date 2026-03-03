import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 3 [S3-D2-03]: PATCH — сортировка фото {ids: string[]} (admin only)
export function PATCH(_req: NextRequest, _ctx: { params: Promise<{ slug: string }> }) {
  return NextResponse.json({})
}
