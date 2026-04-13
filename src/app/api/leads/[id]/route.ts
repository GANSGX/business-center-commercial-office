import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

type Ctx = { params: Promise<{ id: string }> }

// ── DELETE /api/leads/[id] (admin) ────────────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await ctx.params
    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/leads/[id]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/leads/[id] (admin) ─────────────────────────────────────────────

const schema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'PROCESSED']),
})

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await ctx.params
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const lead = await prisma.lead.update({ where: { id }, data: { status: parsed.data.status } })
    return NextResponse.json(lead)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PATCH /api/leads/[id]]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
