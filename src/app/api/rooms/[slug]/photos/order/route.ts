import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── PATCH /api/rooms/[slug]/photos/order (admin) ──────────────────────────────
// Body: { ids: string[] } — массив ID фото в желаемом порядке

const schema = z.object({ ids: z.array(z.string()).min(1) })

export async function PATCH(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { ids } = parsed.data
    await Promise.all(
      ids.map((id, order) => prisma.roomPhoto.update({ where: { id }, data: { order } }))
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[PATCH /api/rooms/[slug]/photos/order]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
