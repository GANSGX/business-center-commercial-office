import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/**
 * Проверяет наличие активной admin-сессии.
 * Использовать в каждом admin-only API route:
 *
 *   const check = await requireAdmin()
 *   if (!check.ok) return check.response
 */
export async function requireAdmin(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const session = await auth()
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true }
}
