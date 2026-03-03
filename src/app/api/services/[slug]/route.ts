import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 2 [S2-D2-04]: GET — одна услуга со всеми options[], 404 если нет
export function GET(_req: NextRequest, _ctx: { params: Promise<{ slug: string }> }) {
  return NextResponse.json({})
}
