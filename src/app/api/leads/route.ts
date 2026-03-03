import { NextResponse } from 'next/server'

// TODO Sprint 2 [S2-D2-02]: POST — создать заявку
//   Zod-валидация, honeypot check (website field), rate limit 5/15min per IP
//   Сохранить в БД, email-уведомление через Nodemailer
// TODO Sprint 3 [S3-D2-06]: GET — список заявок (admin only), фильтр+поиск+пагинация
export function GET() {
  return NextResponse.json({})
}

export function POST() {
  return NextResponse.json({})
}
