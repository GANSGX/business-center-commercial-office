import { NextRequest } from 'next/server'
import { requireAdmin } from '@/shared/lib/require-admin'
import { tenantRequestsEmitter } from '@/shared/lib/tenant-requests-emitter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const enc = (data: string) => new TextEncoder().encode(data)

      controller.enqueue(enc('data: connected\n\n'))

      function onNew() {
        if (closed) return
        controller.enqueue(enc('data: new-tenant-request\n\n'))
      }

      tenantRequestsEmitter.on('new-tenant-request', onNew)

      const heartbeat = setInterval(() => {
        if (closed) return
        controller.enqueue(enc(': heartbeat\n\n'))
      }, 25_000)

      req.signal.addEventListener('abort', () => {
        closed = true
        tenantRequestsEmitter.off('new-tenant-request', onNew)
        clearInterval(heartbeat)
        try {
          controller.close()
        } catch {
          /* уже закрыт */
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
