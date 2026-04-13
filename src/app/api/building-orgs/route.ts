import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { buildingOrgsEmitter } from '@/shared/lib/building-orgs-emitter'

// ── GET /api/building-orgs ───────────────────────────────────────────────────
// ?all=1 — все включая inactive (только admin)

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('all') === '1'

  if (showAll) {
    const check = await requireAdmin()
    if (!check.ok) return check.response
  }

  try {
    const orgs = await prisma.buildingOrg.findMany({
      where: showAll ? undefined : { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(orgs, {
      headers: showAll
        ? { 'Cache-Control': 'no-store' }
        : { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    })
  } catch (e) {
    console.error('[GET /api/building-orgs]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/building-orgs (admin) ─────────────────────────────────────────

const createSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['food', 'service', 'retail', 'bank', 'other']),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  contact: z.string().optional(),
  floor: z.number().int().default(1),
  color: z.string().default('blue'),
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
    const data = {
      ...parsed.data,
      logo: parsed.data.logo || null,
      website: parsed.data.website || null,
      contact: parsed.data.contact || null,
    }
    const org = await prisma.buildingOrg.create({ data })
    buildingOrgsEmitter.emit('orgs-updated')
    return NextResponse.json(org, { status: 201 })
  } catch (e) {
    console.error('[POST /api/building-orgs]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PUT /api/building-orgs (admin) ───────────────────────────────────────────

const updateSchema = createSchema.partial().extend({ id: z.string() })

export async function PUT(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const parsed = updateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { id, ...rest } = parsed.data
    const data = {
      ...rest,
      ...(rest.logo !== undefined ? { logo: rest.logo || null } : {}),
      ...(rest.website !== undefined ? { website: rest.website || null } : {}),
      ...(rest.contact !== undefined ? { contact: rest.contact || null } : {}),
    }
    const org = await prisma.buildingOrg.update({ where: { id }, data })
    buildingOrgsEmitter.emit('orgs-updated')
    return NextResponse.json(org)
  } catch (e) {
    console.error('[PUT /api/building-orgs]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/building-orgs (admin) ────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.buildingOrg.delete({ where: { id } })
    buildingOrgsEmitter.emit('orgs-updated')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/building-orgs]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
