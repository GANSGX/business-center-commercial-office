import { NextResponse } from 'next/server'

// TODO Sprint 1 [S1-D2-01]: GET — список помещений
// Query: status, areaMin, areaMax, floor, priceMin, priceMax, sort, page, limit, showOnHome
// Zod-валидация query params. Cache-Control: max-age=30
// TODO Sprint 3 [S3-D2-01]: POST — создать помещение (admin only, проверка сессии)
export function GET() {
  return NextResponse.json({})
}
