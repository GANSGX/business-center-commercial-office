import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/hero-slides ──────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get('admin') === 'true'

    if (isAdmin) {
      const check = await requireAdmin()
      if (!check.ok) return check.response
      const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } })
      return NextResponse.json(slides)
    }

    const slides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    })
  } catch (e) {
    console.error('[GET /api/hero-slides]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/hero-slides (admin) ─────────────────────────────────────────────

const createSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  image: z.string().min(1),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const slide = await prisma.heroSlide.create({ data: parsed.data })
    return NextResponse.json(slide, { status: 201 })
  } catch (e) {
    console.error('[POST /api/hero-slides]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/hero-slides (admin) ──────────────────────────────────────────────

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
    const slide = await prisma.heroSlide.update({ where: { id }, data })
    return NextResponse.json(slide)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PUT /api/hero-slides]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/hero-slides (admin) ───────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.heroSlide.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/hero-slides]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
