import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/advantages ───────────────────────────────────────────────────────

export async function GET() {
  try {
    const advantages = await prisma.advantage.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(advantages, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    })
  } catch (e) {
    console.error('[GET /api/advantages]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/advantages (admin) ──────────────────────────────────────────────

const createSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  order: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const advantage = await prisma.advantage.create({ data: parsed.data })
    return NextResponse.json(advantage, { status: 201 })
  } catch (e) {
    console.error('[POST /api/advantages]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/advantages (admin) ───────────────────────────────────────────────

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
    const advantage = await prisma.advantage.update({ where: { id }, data })
    return NextResponse.json(advantage)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PUT /api/advantages]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/advantages (admin) ────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.advantage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/advantages]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
