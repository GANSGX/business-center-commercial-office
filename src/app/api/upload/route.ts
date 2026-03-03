import { NextResponse } from 'next/server'

// TODO Sprint 3 [S3-D2-02]: POST — загрузка файла (admin only)
//   Только image/*, ограничение 10MB
//   Uploadthing или S3, возвращает {url: string}
export function POST() {
  return NextResponse.json({})
}
