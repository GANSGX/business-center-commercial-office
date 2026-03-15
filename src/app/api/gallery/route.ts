import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/gallery ──────────────────────────────────────────────────────────

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(images, {
      headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200' },
    })
  } catch (e) {
    console.error('[GET /api/gallery]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/gallery (admin) ─────────────────────────────────────────────────

const createSchema = z.object({
  url: z.string().min(1),
  caption: z.string().optional(),
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
    const image = await prisma.galleryImage.create({ data: parsed.data })
    return NextResponse.json(image, { status: 201 })
  } catch (e) {
    console.error('[POST /api/gallery]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/gallery (admin) ──────────────────────────────────────────────────

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
    const image = await prisma.galleryImage.update({ where: { id }, data })
    return NextResponse.json(image)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PUT /api/gallery]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/gallery (admin) ───────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/gallery]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
