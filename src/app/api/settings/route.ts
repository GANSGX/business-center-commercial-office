import { NextResponse } from 'next/server'

// TODO Sprint 2 [S2-D2-07]: GET — все SiteSettings как {[key]: value}
// TODO Sprint 3 [S3-D2-08]: PATCH — сохранить {key, value}[] батчом через upsert (admin only)
export function GET() {
  return NextResponse.json({})
}

export function PATCH() {
  return NextResponse.json({})
}
