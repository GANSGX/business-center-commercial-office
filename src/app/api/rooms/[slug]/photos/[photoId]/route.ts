import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { unlink } from 'fs/promises'
import { join } from 'path'

type Ctx = { params: Promise<{ slug: string; photoId: string }> }

// ── DELETE /api/rooms/[slug]/photos/[photoId] (admin) ─────────────────────────

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { photoId } = await ctx.params
    const photo = await prisma.roomPhoto.findUnique({ where: { id: photoId } })
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.roomPhoto.delete({ where: { id: photoId } })

    // Удаляем файл если он локальный (начинается с /uploads/)
    if (photo.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', photo.url)
      await unlink(filePath).catch(() => {}) // не блокируем если файл уже удалён
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/rooms/[slug]/photos/[photoId]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
