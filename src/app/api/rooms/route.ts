import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/rooms ────────────────────────────────────────────────────────────

const querySchema = z.object({
  status: z.enum(['FREE', 'RESERVED', 'RENTED']).optional(),
  areaMin: z.coerce.number().optional(),
  areaMax: z.coerce.number().optional(),
  floor: z.coerce.number().int().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'area_asc', 'area_desc', 'newest']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  showOnHome: z.coerce.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const p = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(p)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
    }

    const { status, areaMin, areaMax, floor, priceMin, priceMax, sort, page, limit, showOnHome } =
      parsed.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}
    if (status) where.status = status
    if (floor !== undefined) where.floor = floor
    if (showOnHome !== undefined) where.showOnHome = showOnHome
    if (areaMin !== undefined || areaMax !== undefined) {
      where.area = {}
      if (areaMin !== undefined) where.area.gte = areaMin
      if (areaMax !== undefined) where.area.lte = areaMax
    }
    if (priceMin !== undefined || priceMax !== undefined) {
      where.priceMonth = {}
      if (priceMin !== undefined) where.priceMonth.gte = priceMin
      if (priceMax !== undefined) where.priceMonth.lte = priceMax
    }

    const orderBy =
      sort === 'price_asc'
        ? { priceMonth: 'asc' as const }
        : sort === 'price_desc'
          ? { priceMonth: 'desc' as const }
          : sort === 'area_asc'
            ? { area: 'asc' as const }
            : sort === 'area_desc'
              ? { area: 'desc' as const }
              : { createdAt: 'desc' as const }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          buildingNumber: true,
          roomNumber: true,
          type: true,
          area: true,
          floor: true,
          layoutType: true,
          water: true,
          wc: true,
          windows: true,
          entrance: true,
          rentType: true,
          internet: true,
          minRentTerm: true,
          priceMonth: true,
          priceM2: true,
          description: true,
          suitableFor: true,
          status: true,
          showOnHome: true,
          photos: {
            orderBy: { order: 'asc' },
            take: 1,
            select: { id: true, url: true, order: true },
          },
        },
      }),
      prisma.room.count({ where }),
    ])

    return NextResponse.json(
      { rooms, total, page, limit, pages: Math.ceil(total / limit) },
      { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } }
    )
  } catch (e) {
    console.error('[GET /api/rooms]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/rooms (admin) ───────────────────────────────────────────────────

const createSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  buildingNumber: z.string().optional(),
  roomNumber: z.string().optional(),
  type: z.string().optional(),
  area: z.number().positive(),
  floor: z.number().int().min(0),
  layoutType: z.string().optional(),
  water: z.boolean().default(false),
  wc: z.boolean().default(false),
  windows: z.boolean().default(false),
  entrance: z.string().optional(),
  rentType: z.string().optional(),
  internet: z.string().optional(),
  minRentTerm: z.string().optional(),
  priceMonth: z.number().int().positive(),
  priceM2: z.number().optional(),
  description: z.string().optional(),
  suitableFor: z.array(z.string()).default([]),
  status: z.enum(['FREE', 'RESERVED', 'RENTED']).default('FREE'),
  showOnHome: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const check = await requireAdmin()
    if (!check.ok) return check.response

    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const room = await prisma.room.create({ data: parsed.data })
    return NextResponse.json(room, { status: 201 })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('[POST /api/rooms]', e)
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development' ? String(e) : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// ── PUT /api/rooms (admin) ────────────────────────────────────────────────────

const updateSchema = createSchema.partial().extend({
  id: z.string(),
  buildingNumber: z.string().nullable().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const check = await requireAdmin()
    if (!check.ok) return check.response

    const parsed = updateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { id, ...data } = parsed.data
    const room = await prisma.room.update({ where: { id }, data })
    return NextResponse.json(room)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PUT /api/rooms]', e)
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development' ? String(e) : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// ── DELETE /api/rooms (admin) ─────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const check = await requireAdmin()
    if (!check.ok) return check.response

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.room.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/rooms]', e)
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development' ? String(e) : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
