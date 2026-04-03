import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

const PatchSchema = z.object({
  status: z.enum(['NEW', 'PROCESSED', 'APPROVED', 'REJECTED']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const updated = await prisma.tenantRequest.update({
    where: { id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json(updated)
}
