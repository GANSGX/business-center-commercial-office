import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO Sprint 3 [S3-D2-03]: DELETE — удалить фото помещения (admin only)
export function DELETE(
  _req: NextRequest,
  _ctx: { params: Promise<{ slug: string; photoId: string }> }
) {
  return NextResponse.json({})
}
