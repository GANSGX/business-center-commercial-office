import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
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
}) {
  if (!process.env.EMAIL_HOST) return // не настроен — молча пропускаем
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
  const subject = `Новая заявка от ${lead.name}`
  const text = [
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.roomId ? `Помещение ID: ${lead.roomId}` : null,
    lead.serviceName ? `Услуга: ${lead.serviceName}` : null,
    lead.message ? `\nСообщение:\n${lead.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject,
    text,
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

    // Email-уведомление — не блокируем ответ
    sendLeadEmail(lead).catch((e) => console.error('[leads email]', e))

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
