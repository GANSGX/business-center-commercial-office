import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
  roomId: z.string().optional(),
  serviceName: z.string().optional(),
  pageUrl: z.string().optional(),
  utm: z.record(z.string(), z.string()).optional(),
  website: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    if (parsed.data.website) return NextResponse.json({ ok: true })
    // Demo mode — просто возвращаем успех без сохранения
    return NextResponse.json({ ok: true, id: 'demo' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ leads: [], total: 0, page: 1, limit: 20, pages: 0 })
}
