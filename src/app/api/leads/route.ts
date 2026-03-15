import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { leadsEmitter } from '@/shared/lib/leads-emitter'
import nodemailer from 'nodemailer'

// ── Rate limit (in-memory, 5 req / 15 min per IP) ────────────────────────────

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// ── Nodemailer ────────────────────────────────────────────────────────────────

async function sendLeadEmail(lead: {
  name: string
  phone: string
  email?: string | null
  message?: string | null
  roomId?: string | null
  serviceName?: string | null
  pageUrl?: string | null
  createdAt: Date
}) {
  if (!process.env.EMAIL_HOST) return
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    socketTimeout: 15_000,
  })

  const subject = `📩 Новая заявка от ${lead.name}`

  const date = new Date(lead.createdAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;color:#6b7280;font-size:13px;white-space:nowrap;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:500;vertical-align:top;">${value}</td>
    </tr>`

  const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Шапка -->
        <tr>
          <td style="background:#8b5523;border-radius:12px 12px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Бизнес-центр</p>
                  <h1 style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Коммунистическая, 35</h1>
                </td>
                <td align="right">
                  <span style="display:inline-block;background:rgba(255,255,255,0.15);color:#ffffff;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;">Новая заявка</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Тело -->
        <tr>
          <td style="background:#ffffff;padding:32px;">
            <h2 style="margin:0 0 6px;color:#111827;font-size:20px;font-weight:700;">${lead.name}</h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Заявка получена ${date}</p>

            <!-- Таблица данных -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;overflow:hidden;">
              ${row('Имя', lead.name)}
              <tr><td colspan="2" style="height:1px;background:#f3f4f6;padding:0;"></td></tr>
              ${row('Телефон', `<a href="tel:${lead.phone}" style="color:#8b5523;text-decoration:none;">${lead.phone}</a>`)}
              ${lead.email ? `<tr><td colspan="2" style="height:1px;background:#f3f4f6;padding:0;"></td></tr>${row('Email', `<a href="mailto:${lead.email}" style="color:#8b5523;text-decoration:none;">${lead.email}</a>`)}` : ''}
              ${lead.serviceName ? `<tr><td colspan="2" style="height:1px;background:#f3f4f6;padding:0;"></td></tr>${row('Помещение', lead.serviceName)}` : ''}
              ${lead.pageUrl ? `<tr><td colspan="2" style="height:1px;background:#f3f4f6;padding:0;"></td></tr>${row('Страница', `<a href="${lead.pageUrl}" style="color:#8b5523;font-size:12px;word-break:break-all;">${lead.pageUrl}</a>`)}` : ''}
            </table>

            ${
              lead.message
                ? `
            <!-- Сообщение -->
            <div style="margin-top:20px;background:#fdf8f4;border-left:3px solid #8b5523;border-radius:0 8px 8px 0;padding:16px 20px;">
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Сообщение</p>
              <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">${lead.message.replace(/\n/g, '<br>')}</p>
            </div>`
                : ''
            }
          </td>
        </tr>

        <!-- Подвал -->
        <tr>
          <td style="background:#f9fafb;border-radius:0 0 12px 12px;padding:20px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              Это автоматическое уведомление — не отвечайте на это письмо.<br>
              БЦ Коммунистическая, 35
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = [
    `Новая заявка — ${date}`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.serviceName ? `Помещение: ${lead.serviceName}` : null,
    lead.message ? `\nСообщение:\n${lead.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  await transporter.sendMail({
    from: `"БЦ Коммунистическая, 35" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    text,
    html,
  })
}

// ── POST /api/leads ───────────────────────────────────────────────────────────

const createSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
  roomId: z.string().optional(),
  serviceName: z.string().optional(),
  pageUrl: z.string().optional(),
  utm: z.record(z.string(), z.string()).optional(),
  website: z.string().max(0).optional(), // honeypot — должно быть пустым
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { website, utm, email, ...rest } = parsed.data

    // Honeypot check — если поле заполнено, молча игнорируем
    if (website) return NextResponse.json({ ok: true })

    const lead = await prisma.lead.create({
      data: {
        ...rest,
        email: email || null,
        utm: utm,
      },
    })

    // Уведомляем SSE-подписчиков (админки) мгновенно
    leadsEmitter.emit('new-lead')

    // Email-уведомление — не блокируем ответ
    sendLeadEmail(lead).catch((e) => console.error('[leads email]', e?.message ?? e))

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/leads]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/leads (admin) ────────────────────────────────────────────────────

const querySchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'PROCESSED']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const p = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(p)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
    }
    const { status, search, page, limit } = parsed.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (e) {
    console.error('[GET /api/leads]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
