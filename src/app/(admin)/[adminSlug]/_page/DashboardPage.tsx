'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { LeadStatus } from '@/entities/lead'
import styles from './DashboardPage.module.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  PROCESSED: 'Обработана',
}
const STATUS_CLS: Record<LeadStatus, string> = {
  NEW: styles.badgeNew,
  IN_PROGRESS: styles.badgeProgress,
  PROCESSED: styles.badgeDone,
}
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// ── SVG Area Chart ─────────────────────────────────────────────────────────────

function AreaChart({ data, color, gradId }: { data: number[]; color: string; gradId: string }) {
  const W = 500,
    H = 80,
    P = 3
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => [
    P + (i / Math.max(data.length - 1, 1)) * (W - P * 2),
    P + (1 - v / max) * (H - P * 2 - 8),
  ])
  const line = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const last = pts[pts.length - 1]
  const first = pts[0]
  const area = `${line} L${last[0].toFixed(1)},${H} L${first[0].toFixed(1)},${H} Z`
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last[0].toFixed(1)}
        cy={last[1].toFixed(1)}
        r="3"
        fill={color}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// ── CSS Bar Chart ──────────────────────────────────────────────────────────────

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className={styles.barChart}>
      {data.map((v, i) => (
        <div key={i} className={styles.barItem}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ height: `${(v / max) * 100}%` }}>
              {v > 0 && <span className={styles.barTip}>{v}</span>}
            </div>
          </div>
          <span className={styles.barLabel}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ── Donut Chart ────────────────────────────────────────────────────────────────

function DonutChart({
  free,
  reserved,
  rented,
}: {
  free: number
  reserved: number
  rented: number
}) {
  const total = free + reserved + rented
  if (total === 0) return <p className={styles.emptyHint}>Помещений пока нет</p>
  const fP = (free / total) * 100
  const rP = (reserved / total) * 100
  const donutStyle = {
    background: `conic-gradient(#22c55e 0% ${fP.toFixed(1)}%, #f59e0b ${fP.toFixed(1)}% ${(fP + rP).toFixed(1)}%, #ef4444 ${(fP + rP).toFixed(1)}% 100%)`,
  }
  return (
    <div className={styles.donutWrap}>
      <div className={styles.donut} style={donutStyle}>
        <div className={styles.donutHole}>
          <span className={styles.donutPct}>{Math.round(fP)}%</span>
          <span className={styles.donutSub}>свободно</span>
        </div>
      </div>
      <div className={styles.legend}>
        {[
          { color: '#22c55e', label: 'Свободно', val: free },
          { color: '#f59e0b', label: 'Забронировано', val: reserved },
          { color: '#ef4444', label: 'Занято', val: rented },
        ].map(({ color, label, val }) => (
          <div key={label} className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: color }} />
            <span className={styles.legendLabel}>{label}</span>
            <span className={styles.legendVal}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface RoomItem {
  status: string
}

interface LeadItem {
  id: string
  createdAt: string
  name: string
  phone: string
  roomId?: string | null
  roomTitle?: string | null
  serviceName?: string | null
  status: LeadStatus
}

interface AnalyticsData {
  viewsByDay: number[]
  visitorsByDay: number[]
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  yesterdayViews: number
  todayVisitors: number
  topPages: { path: string; count: number }[]
  deviceBreakdown: { mobile?: number; desktop?: number }
}

export function DashboardPage() {
  const params = useParams()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const [rooms, setRooms] = useState<RoomItem[]>([])
  const [allLeads, setAllLeads] = useState<LeadItem[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const es = new EventSource('/api/dashboard/stream')

    es.onmessage = (e) => {
      try {
        const snap = JSON.parse(e.data)
        if (snap.rooms) setRooms(snap.rooms)
        if (snap.leads) setAllLeads(snap.leads)
        if (snap.analytics) setAnalytics(snap.analytics)
      } catch {
        /* ignore malformed messages */
      }
    }

    return () => es.close()
  }, [])

  // Room stats
  const freeRooms = rooms.filter((r) => r.status === 'FREE').length
  const reservedRooms = rooms.filter((r) => r.status === 'RESERVED').length
  const rentedRooms = rooms.filter((r) => r.status === 'RENTED').length
  const totalRooms = rooms.length

  // Lead stats
  const newLeads = allLeads.filter((l) => l.status === 'NEW').length
  const inProgress = allLeads.filter((l) => l.status === 'IN_PROGRESS').length
  const processed = allLeads.filter((l) => l.status === 'PROCESSED').length
  const totalLeads = allLeads.length

  // Today's leads
  const today = todayStr()
  const todayLeads = allLeads.filter((l) => l.createdAt.slice(0, 10) === today).length
  const yesterday = daysAgo(1)
  const yesterdayLeads = allLeads.filter((l) => l.createdAt.slice(0, 10) === yesterday).length
  const deltaPct =
    yesterdayLeads > 0
      ? Math.round(((todayLeads - yesterdayLeads) / yesterdayLeads) * 100)
      : todayLeads > 0
        ? 100
        : 0

  // Leads per day — last 30 days
  const leads30d = useMemo(() => {
    const counts: number[] = Array(30).fill(0)
    const now = new Date()
    allLeads.forEach((l) => {
      const d = new Date(l.createdAt)
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 30) counts[29 - diff]++
    })
    return counts
  }, [allLeads])

  // Leads per day of week — last 7 days (Mon–Sun order)
  const leads7d = useMemo(() => {
    const counts: number[] = Array(7).fill(0)
    const now = new Date()
    allLeads.forEach((l) => {
      const d = new Date(l.createdAt)
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 7) counts[6 - diff]++
    })
    return counts
  }, [allLeads])

  // X-axis labels for 30d chart
  const xLabels = useMemo(() => {
    const labels: string[] = []
    const months = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ]
    for (const offset of [29, 22, 15, 7, 0]) {
      const d = new Date()
      d.setDate(d.getDate() - offset)
      labels.push(`${d.getDate()} ${months[d.getMonth()]}`)
    }
    return labels
  }, [])

  const recentLeads = [...allLeads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const nowStr = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Дашборд</h1>
          <p className={styles.subtitle}>{nowStr} · данные обновляются в реальном времени</p>
        </div>
        <Link href={`${base}/analytics`} className={styles.metrikaBtn}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Яндекс.Метрика
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className={styles.kpiGrid}>
        {/* Заявок сегодня */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Заявок сегодня</span>
            {yesterdayLeads > 0 && (
              <span
                className={`${styles.delta} ${deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}`}
              >
                {deltaPct >= 0 ? '↑' : '↓'} {Math.abs(deltaPct)}%
              </span>
            )}
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={leads30d.slice(-7)} color="#8b5523" gradId="sp1" />
          </div>
          <div className={styles.kpiValue}>{todayLeads}</div>
          <div className={styles.kpiMeta}>вчера: {yesterdayLeads}</div>
        </div>

        {/* Заявок за 30 дней */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>За 30 дней</span>
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={leads30d} color="#6366f1" gradId="sp2" />
          </div>
          <div className={styles.kpiValue}>{leads30d.reduce((a, b) => a + b, 0)}</div>
          <div className={styles.kpiMeta}>всего заявок: {totalLeads}</div>
        </div>

        {/* Новые заявки */}
        <div className={`${styles.kpiCard} ${newLeads > 0 ? styles.kpiCardAlert : ''}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Новых заявок</span>
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={leads7d} color="#22c55e" gradId="sp3" />
          </div>
          <div className={styles.kpiValue}>{newLeads}</div>
          <div className={styles.kpiMeta}>
            {newLeads > 0 && <span className={styles.alertDot}>{newLeads} требуют ответа</span>}
            {inProgress > 0 && <span> · {inProgress} в работе</span>}
            {newLeads === 0 && inProgress === 0 && <span>всё обработано</span>}
          </div>
        </div>

        {/* Помещения */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Помещений</span>
          </div>
          <div className={styles.kpiValue}>{totalRooms}</div>
          <div className={styles.kpiMeta}>
            {freeRooms > 0 && <span style={{ color: '#22c55e' }}>{freeRooms} свободно</span>}
            {reservedRooms > 0 && <span> · {reservedRooms} бронь</span>}
            {rentedRooms > 0 && <span> · {rentedRooms} занято</span>}
            {totalRooms === 0 && 'нет помещений'}
          </div>
        </div>
      </div>

      {/* ── Leads 30d Chart ── */}
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <h2 className={styles.cardTitle}>Заявки за 30 дней</h2>
            <p className={styles.cardDesc}>динамика обращений</p>
          </div>
          <Link href={`${base}/leads`} className={styles.cardLink}>
            Все заявки →
          </Link>
        </div>
        <div className={styles.visitChart}>
          <div className={styles.yAxis}>
            {[Math.max(...leads30d), Math.round(Math.max(...leads30d) / 2), 0].map((v, i) => (
              <span key={i} className={styles.yTick}>
                {v}
              </span>
            ))}
          </div>
          <div className={styles.chartBody}>
            <div className={styles.chartSvg}>
              <AreaChart data={leads30d} color="#8b5523" gradId="main" />
            </div>
            <div className={styles.xAxis}>
              {xLabels.map((l) => (
                <span key={l} className={styles.xTick}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mid Row: Occupancy + Leads 7d ── */}
      <div className={styles.midRow}>
        {/* Occupancy */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>Загруженность</h2>
              <p className={styles.cardDesc}>{totalRooms} помещений</p>
            </div>
            <Link href={`${base}/rooms`} className={styles.cardLink}>
              Управлять →
            </Link>
          </div>
          <DonutChart free={freeRooms} reserved={reservedRooms} rented={rentedRooms} />
        </div>

        {/* Leads 7d */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>Заявки</h2>
              <p className={styles.cardDesc}>последние 7 дней</p>
            </div>
            <Link href={`${base}/leads`} className={styles.cardLink}>
              Все заявки →
            </Link>
          </div>
          <BarChart data={leads7d} labels={DAYS_SHORT} />
          <div className={styles.funnel}>
            {[
              { color: '#ef4444', label: 'Новые', val: newLeads },
              { color: '#f59e0b', label: 'В работе', val: inProgress },
              { color: '#22c55e', label: 'Обработаны', val: processed },
            ].map(({ color, label, val }) => (
              <div key={label} className={styles.funnelRow}>
                <span className={styles.funnelDot} style={{ background: color }} />
                <span className={styles.funnelLabel}>{label}</span>
                <div className={styles.funnelBar}>
                  <div
                    className={styles.funnelFill}
                    style={{
                      width: totalLeads > 0 ? `${(val / totalLeads) * 100}%` : '0%',
                      background: color,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <span className={styles.funnelVal}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Analytics ── */}
      {analytics ? (
        <>
          <div className={styles.kpiGrid}>
            {/* Просмотров сегодня */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>Просмотров сегодня</span>
                {analytics.yesterdayViews > 0 && (
                  <span
                    className={`${styles.delta} ${analytics.todayViews >= analytics.yesterdayViews ? styles.deltaUp : styles.deltaDown}`}
                  >
                    {analytics.todayViews >= analytics.yesterdayViews ? '↑' : '↓'}{' '}
                    {analytics.yesterdayViews > 0
                      ? Math.abs(
                          Math.round(
                            ((analytics.todayViews - analytics.yesterdayViews) /
                              analytics.yesterdayViews) *
                              100
                          )
                        )
                      : 100}
                    %
                  </span>
                )}
              </div>
              <div className={styles.kpiSpark}>
                <AreaChart data={analytics.viewsByDay.slice(-7)} color="#8b5523" gradId="av1" />
              </div>
              <div className={styles.kpiValue}>{analytics.todayViews}</div>
              <div className={styles.kpiMeta}>вчера: {analytics.yesterdayViews}</div>
            </div>

            {/* Уникальных посетителей */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>Посетителей за 30 дней</span>
              </div>
              <div className={styles.kpiSpark}>
                <AreaChart data={analytics.visitorsByDay} color="#6366f1" gradId="av2" />
              </div>
              <div className={styles.kpiValue}>{analytics.uniqueVisitors}</div>
              <div className={styles.kpiMeta}>просмотров всего: {analytics.totalViews}</div>
            </div>

            {/* Сегодня посетителей */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>Посетителей сегодня</span>
              </div>
              <div className={styles.kpiSpark}>
                <AreaChart data={analytics.visitorsByDay.slice(-7)} color="#22c55e" gradId="av3" />
              </div>
              <div className={styles.kpiValue}>{analytics.todayVisitors}</div>
              <div className={styles.kpiMeta}>
                mobile: {analytics.deviceBreakdown.mobile ?? 0} · desktop:{' '}
                {analytics.deviceBreakdown.desktop ?? 0}
              </div>
            </div>

            {/* Конверсия */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>Конверсия (30 дней)</span>
              </div>
              <div className={styles.kpiValue}>
                {analytics.uniqueVisitors > 0
                  ? ((allLeads.length / analytics.uniqueVisitors) * 100).toFixed(2)
                  : '0.00'}
                %
              </div>
              <div className={styles.kpiMeta}>
                {allLeads.length} заявок / {analytics.uniqueVisitors} посетителей
              </div>
            </div>
          </div>

          {/* Посещаемость + топ страниц */}
          <div className={styles.midRow}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <h2 className={styles.cardTitle}>Просмотры за 30 дней</h2>
                  <p className={styles.cardDesc}>страниц сайта</p>
                </div>
              </div>
              <div className={styles.visitChart}>
                <div className={styles.yAxis}>
                  {[
                    Math.max(...analytics.viewsByDay),
                    Math.round(Math.max(...analytics.viewsByDay) / 2),
                    0,
                  ].map((v, i) => (
                    <span key={i} className={styles.yTick}>
                      {v}
                    </span>
                  ))}
                </div>
                <div className={styles.chartBody}>
                  <div className={styles.chartSvg}>
                    <AreaChart data={analytics.viewsByDay} color="#6366f1" gradId="views30" />
                  </div>
                  <div className={styles.xAxis}>
                    {xLabels.map((l) => (
                      <span key={l} className={styles.xTick}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <h2 className={styles.cardTitle}>Топ страниц</h2>
                  <p className={styles.cardDesc}>за 30 дней</p>
                </div>
              </div>
              <div className={styles.topPages}>
                {analytics.topPages.length === 0 && (
                  <p className={styles.emptyHint}>Данных пока нет</p>
                )}
                {analytics.topPages.map(({ path, count }) => {
                  const maxCount = analytics.topPages[0]?.count ?? 1
                  return (
                    <div key={path} className={styles.topPageRow}>
                      <span className={styles.topPagePath}>{path || '/'}</span>
                      <div className={styles.topPageTrack}>
                        <div
                          className={styles.topPageFill}
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className={styles.topPageCount}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className={styles.card}
          style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Данных о посещениях пока нет. Откройте публичный сайт, примите куки — и посещения начнут
            отображаться здесь.
          </p>
        </div>
      )}

      {/* ── Recent Leads ── */}
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <h2 className={styles.cardTitle}>Последние заявки</h2>
            <p className={styles.cardDesc}>актуальные обращения</p>
          </div>
          <Link href={`${base}/leads`} className={styles.cardLink}>
            Все заявки →
          </Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Помещение</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => {
                const { date, time } = fmt(lead.createdAt)
                return (
                  <tr key={lead.id}>
                    <td>
                      <span className={styles.dateCell}>
                        {date}
                        <span className={styles.timeCell}>{time}</span>
                      </span>
                    </td>
                    <td className={styles.nameCell}>{lead.name}</td>
                    <td className={styles.phoneCell}>{lead.phone}</td>
                    <td className={styles.mutedCell}>
                      {lead.roomTitle ?? lead.serviceName ?? '—'}
                    </td>
                    <td>
                      <span className={STATUS_CLS[lead.status]}>{STATUS_LABELS[lead.status]}</span>
                    </td>
                  </tr>
                )
              })}
              {recentLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: 'center',
                      color: 'var(--color-text-muted)',
                      padding: '1.5rem',
                    }}
                  >
                    Заявок пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
