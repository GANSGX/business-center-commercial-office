import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/services ─────────────────────────────────────────────────────────

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { options: { orderBy: { order: 'asc' } } },
    })
    return NextResponse.json(services, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    })
  } catch (e) {
    console.error('[GET /api/services]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/services (admin) ────────────────────────────────────────────────

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  content: z.string().optional(),
  image: z.string().optional(),
  priceText: z.string().optional(),
  order: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const service = await prisma.service.create({ data: parsed.data })
    return NextResponse.json(service, { status: 201 })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('[POST /api/services]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/services (admin) ─────────────────────────────────────────────────

const updateSchema = createSchema.partial().extend({ id: z.string() })

export async function PUT(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = updateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { id, ...data } = parsed.data
    const service = await prisma.service.update({ where: { id }, data })
    return NextResponse.json(service)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PUT /api/services]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/services (admin) ──────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/services]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
