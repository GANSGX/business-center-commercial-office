import { NextRequest } from 'next/server'
import { requireAdmin } from '@/shared/lib/require-admin'
import { leadsEmitter } from '@/shared/lib/leads-emitter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const enc = (data: string) => new TextEncoder().encode(data)

      // Сообщаем клиенту что соединение установлено
      controller.enqueue(enc('data: connected\n\n'))

      function onNewLead() {
        if (closed) return
        controller.enqueue(enc('data: new-lead\n\n'))
      }

      leadsEmitter.on('new-lead', onNewLead)

      // Heartbeat каждые 25 сек чтобы прокси не закрыл соединение
      const heartbeat = setInterval(() => {
        if (closed) return
        controller.enqueue(enc(': heartbeat\n\n'))
      }, 25_000)

      // Клиент закрыл вкладку / перешёл на другую страницу
      req.signal.addEventListener('abort', () => {
        closed = true
        leadsEmitter.off('new-lead', onNewLead)
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
      'X-Accel-Buffering': 'no', // отключаем буферизацию Nginx
    },
  })
}
