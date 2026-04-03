import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { tenantRequestsEmitter } from '@/shared/lib/tenant-requests-emitter'

const CreateSchema = z.object({
  companyName: z.string().min(2).max(100),
  category: z.enum(['food', 'service', 'retail', 'bank', 'other']),
  floor: z.number().int().min(1).max(50).optional(),
  description: z.string().max(800).optional(),
  contactName: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(), // honeypot
})

// POST /api/tenant-requests — публичный, с honeypot
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { website, ...data } = parsed.data
  if (website) return NextResponse.json({ ok: true }) // honeypot сработал — молча игнорируем

  await prisma.tenantRequest.create({
    data: {
      companyName: data.companyName,
      category: data.category,
      floor: data.floor ?? null,
      description: data.description || null,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email || null,
    },
  })

  tenantRequestsEmitter.emit('new-tenant-request')

  return NextResponse.json({ ok: true }, { status: 201 })
}

// GET /api/tenant-requests — только для admin
export async function GET(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.trim()
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = 20

  const where: Record<string, unknown> = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { contactName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.tenantRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tenantRequest.count({ where }),
  ])

  return NextResponse.json({ items, total, page, limit })
}

// PATCH /api/tenant-requests/[id] — смена статуса (отдельный route ниже)
