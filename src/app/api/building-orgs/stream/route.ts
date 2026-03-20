import { NextRequest } from 'next/server'
import { buildingOrgsEmitter } from '@/shared/lib/building-orgs-emitter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Публичный SSE — клиенты публичной страницы «В здании» подписываются сюда
export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      let closed = false
      const enc = (data: string) => new TextEncoder().encode(data)

      controller.enqueue(enc('data: connected\n\n'))

      function onUpdate() {
        if (closed) return
        controller.enqueue(enc('data: orgs-updated\n\n'))
      }

      buildingOrgsEmitter.on('orgs-updated', onUpdate)

      const heartbeat = setInterval(() => {
        if (closed) return
        controller.enqueue(enc(': heartbeat\n\n'))
      }, 25_000)

      req.signal.addEventListener('abort', () => {
        closed = true
        buildingOrgsEmitter.off('orgs-updated', onUpdate)
        clearInterval(heartbeat)
        try {
          controller.close()
        } catch {
          /* already closed */
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
