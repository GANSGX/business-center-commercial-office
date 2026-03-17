import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

type Ctx = { params: Promise<{ slug: string }> }

// ── POST /api/rooms/[slug]/photos (admin) ─────────────────────────────────────
// Принимает multipart/form-data с полем `file`. Slug в URL — это ID помещения.

export async function POST(req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { slug: roomId } = await ctx.params

    // Проверяем что помещение существует
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

    // Только изображения, до 10MB
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXT.includes(ext as (typeof ALLOWED_EXT)[number])) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    const url = `/uploads/${filename}`

    // Определяем следующий order
    const last = await prisma.roomPhoto.findFirst({
      where: { roomId },
      orderBy: { order: 'desc' },
    })
    const order = (last?.order ?? -1) + 1

    const photo = await prisma.roomPhoto.create({ data: { url, order, roomId } })
    return NextResponse.json(photo, { status: 201 })
  } catch (e) {
    console.error('[POST /api/rooms/[slug]/photos]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
