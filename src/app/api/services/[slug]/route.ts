import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

type Ctx = { params: Promise<{ slug: string }> }

// ── GET /api/services/[slug] ──────────────────────────────────────────────────

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { slug } = await ctx.params
    const service = await prisma.service.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { options: { orderBy: { order: 'asc' } } },
    })
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(service, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    })
  } catch (e) {
    console.error('[GET /api/services/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/services/[slug] (admin) ───────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { slug } = await ctx.params
    await prisma.service.delete({ where: { id: slug } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/services/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── ServiceOption CRUD via /api/services/[id]/options ───────────────────────
// POST body: { label, description?, price?, order? }
// DELETE body: { optionId }

const optionCreateSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  order: z.number().int().default(0),
})

export async function POST(req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { slug: serviceId } = await ctx.params
    const parsed = optionCreateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const option = await prisma.serviceOption.create({
      data: { ...parsed.data, serviceId },
    })
    return NextResponse.json(option, { status: 201 })
  } catch (e) {
    console.error('[POST /api/services/[slug]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
