import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 3 [S3-D2-06]: PATCH — смена статуса заявки (admin only)
export function PATCH(_req: NextRequest, _ctx: { params: Promise<{ id: string }> }) {
  return NextResponse.json({})
}
