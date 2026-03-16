import { NextRequest } from 'next/server'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'
import { dashboardEmitter } from '@/shared/lib/dashboard-emitter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getSnapshot() {
  const now = new Date()

  // Все даты в UTC — чтобы не зависеть от часового пояса сервера
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1)
  const startOf30d = new Date(startOfToday)
  startOf30d.setUTCDate(startOf30d.getUTCDate() - 29)

  const [rooms, leads] = await Promise.all([
    prisma.room.findMany({ select: { status: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 1000 }),
  ])

  let views30d: { createdAt: Date; visitorId: string; path: string; device: string | null }[] = []
  let todayViews = 0
  let yesterdayViews = 0
  try {
    ;[views30d, todayViews, yesterdayViews] = await Promise.all([
      prisma.pageView.findMany({
        where: { createdAt: { gte: startOf30d } },
        select: { createdAt: true, visitorId: true, path: true, device: true },
      }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfYesterday, lt: startOfToday } } }),
    ])
  } catch (e) {
    console.error('[dashboard/stream] pageView query failed:', e)
  }

  // Aggregate analytics
  const viewsByDay: number[] = Array(30).fill(0)
  const visitorsByDay: Set<string>[] = Array.from({ length: 30 }, () => new Set())
  const pageCounts: Record<string, number> = {}
  const deviceVisitors: Record<string, Set<string>> = { mobile: new Set(), desktop: new Set() }
  const allVisitors = new Set<string>()
  const todayVisitors = new Set<string>()

  for (const v of views30d) {
    const vDate = new Date(v.createdAt)
    const vDay = Date.UTC(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate())
    const diff = Math.round((startOfToday.getTime() - vDay) / 86400000)
    if (diff >= 0 && diff < 30) {
      viewsByDay[29 - diff]++
      visitorsByDay[29 - diff].add(v.visitorId)
    }
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1
    if (v.device) deviceVisitors[v.device]?.add(v.visitorId)
    allVisitors.add(v.visitorId)
    if (vDay >= startOfToday.getTime()) todayVisitors.add(v.visitorId)
  }

  const deviceCounts = {
    mobile: deviceVisitors.mobile.size,
    desktop: deviceVisitors.desktop.size,
  }

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, count]) => ({ path, count }))

  return {
    rooms,
    leads,
    analytics: {
      viewsByDay,
      visitorsByDay: visitorsByDay.map((s) => s.size),
      totalViews: views30d.length,
      uniqueVisitors: allVisitors.size,
      todayViews,
      yesterdayViews,
      todayVisitors: todayVisitors.size,
      topPages,
      deviceBreakdown: deviceCounts,
    },
  }
}

export async function GET(req: NextRequest) {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false
      const enc = (data: string) => new TextEncoder().encode(data)

      const sendSnapshot = async () => {
        if (closed) return
        try {
          const snap = await getSnapshot()
          if (closed) return
          controller.enqueue(enc(`data: ${JSON.stringify(snap)}\n\n`))
        } catch (e) {
          if ((e as NodeJS.ErrnoException)?.code !== 'ERR_INVALID_STATE') {
            console.error('[dashboard/stream]', e)
          }
        }
      }

      // Начальный снепшот при подключении
      await sendSnapshot()

      // Обновляем при новых лидах или просмотрах
      dashboardEmitter.on('update', sendSnapshot)

      // Heartbeat чтобы прокси не закрыл соединение
      const heartbeat = setInterval(() => {
        if (closed) return
        controller.enqueue(enc(': heartbeat\n\n'))
      }, 25_000)

      req.signal.addEventListener('abort', () => {
        closed = true
        dashboardEmitter.off('update', sendSnapshot)
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
