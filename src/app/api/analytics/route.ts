import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'
import { requireAdmin } from '@/shared/lib/require-admin'

export async function GET() {
  const check = await requireAdmin()
  if (!check.ok) return check.response

  const now = new Date()

  const startOf30d = new Date(now)
  startOf30d.setDate(startOf30d.getDate() - 29)
  startOf30d.setHours(0, 0, 0, 0)

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const [allViews, todayViews, yesterdayViews] = await Promise.all([
    prisma.pageView.findMany({
      where: { createdAt: { gte: startOf30d } },
      select: { createdAt: true, visitorId: true, path: true, device: true },
    }),
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({
      where: { createdAt: { gte: startOfYesterday, lt: startOfToday } },
    }),
  ])

  const viewsByDay: number[] = Array(30).fill(0)
  const visitorsByDay: Set<string>[] = Array.from({ length: 30 }, () => new Set())
  const pageCounts: Record<string, number> = {}
  const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0 }
  const allVisitors = new Set<string>()
  const todayVisitors = new Set<string>()

  for (const v of allViews) {
    const diff = Math.floor((now.getTime() - new Date(v.createdAt).getTime()) / 86400000)
    if (diff >= 0 && diff < 30) {
      viewsByDay[29 - diff]++
      visitorsByDay[29 - diff].add(v.visitorId)
    }
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1
    if (v.device) deviceCounts[v.device] = (deviceCounts[v.device] ?? 0) + 1
    allVisitors.add(v.visitorId)
    if (new Date(v.createdAt) >= startOfToday) todayVisitors.add(v.visitorId)
  }

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, count]) => ({ path, count }))

  return NextResponse.json({
    viewsByDay,
    visitorsByDay: visitorsByDay.map((s) => s.size),
    totalViews: allViews.length,
    uniqueVisitors: allVisitors.size,
    todayViews,
    yesterdayViews,
    todayVisitors: todayVisitors.size,
    topPages,
    deviceBreakdown: deviceCounts,
  })
}
