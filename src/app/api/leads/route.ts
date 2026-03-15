import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { leadsEmitter } from '@/shared/lib/leads-emitter'

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
  limit: z.coerce.number().int().min(1).max(1000).default(20),
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
