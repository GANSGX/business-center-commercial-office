import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/shared/lib/require-admin'
import { convertToWebp } from '@/shared/lib/convertToWebp'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// ── POST /api/upload (admin) ──────────────────────────────────────────────────
// Принимает multipart/form-data с полем `file`.
// Только image/*, максимум 10MB.
// Сохраняет в public/uploads/, возвращает { url: string }.

export async function POST(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

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

    const rawBuffer = Buffer.from(await file.arrayBuffer())
    const { buffer, filename } = await convertToWebp(rawBuffer, file.name, randomUUID())

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/upload]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
