import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 3 [S3-D2-03]: POST — загрузить фото к помещению (admin only)
export function POST(_req: NextRequest, _ctx: { params: Promise<{ id: string }> }) {
  return NextResponse.json({})
}
