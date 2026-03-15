import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Временный эндпоинт для диагностики — удалить после проверки
export async function GET() {
  const cfg = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'НЕ ЗАДАН',
    to: process.env.EMAIL_TO,
  }

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json({ ok: false, error: 'Env vars не заданы', cfg })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })

    await transporter.verify()

    await transporter.sendMail({
      from: `"Тест БЦ" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: 'Тестовое письмо — БЦ Коммунистическая',
      text: 'Если вы видите это письмо — email работает корректно.',
    })

    return NextResponse.json({ ok: true, message: 'Письмо отправлено!', cfg })
  } catch (e: unknown) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      cfg,
    })
  }
}
