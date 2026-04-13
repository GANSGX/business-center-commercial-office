import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

// ── GET /api/settings ─────────────────────────────────────────────────────────
// Возвращает все настройки как объект { [key]: value }

export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany()
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    })
  } catch (e) {
    console.error('[GET /api/settings]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/settings (admin) ───────────────────────────────────────────────
// Body: { [key]: value } — частичное обновление через upsert

const schema = z.record(z.string(), z.string())

export async function PATCH(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const entries = Object.entries(parsed.data)
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }
    await Promise.all(
      entries.map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[PATCH /api/settings]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
