import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

type Ctx = { params: Promise<{ slug: string }> }

// ── GET /api/rooms/[slug] ─────────────────────────────────────────────────────

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { slug } = await ctx.params
    const room = await prisma.room.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
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
        photos: { orderBy: { order: 'asc' }, select: { id: true, url: true, order: true } },
      },
    })
    if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(room, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    })
  } catch (e) {
    console.error('[GET /api/rooms/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/rooms/[slug] (admin) ─────────────────────────────────────────────

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  buildingNumber: z.string().nullable().optional(),
  roomNumber: z.string().optional(),
  type: z.string().optional(),
  area: z.number().positive().optional(),
  floor: z.number().int().min(0).optional(),
  layoutType: z.string().optional(),
  water: z.boolean().optional(),
  wc: z.boolean().optional(),
  windows: z.boolean().optional(),
  entrance: z.string().optional(),
  rentType: z.string().optional(),
  internet: z.string().optional(),
  minRentTerm: z.string().optional(),
  priceMonth: z.number().int().positive().optional(),
  priceM2: z.number().optional(),
  description: z.string().optional(),
  suitableFor: z.array(z.string()).optional(),
  status: z.enum(['FREE', 'RESERVED', 'RENTED']).optional(),
  showOnHome: z.boolean().optional(),
})

export async function PUT(req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { slug } = await ctx.params
    const parsed = updateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    // Найти по slug или id, затем обновить по id
    const existing = await prisma.room.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const room = await prisma.room.update({ where: { id: existing.id }, data: parsed.data })
    return NextResponse.json(room)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('[PUT /api/rooms/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/rooms/[slug] (admin) ──────────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { slug } = await ctx.params
    // Найти по slug или id, затем удалить по id
    const existing = await prisma.room.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.room.delete({ where: { id: existing.id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('[DELETE /api/rooms/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
