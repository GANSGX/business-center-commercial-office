'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_ROOMS } from '@/entities/room'
import { MOCK_LEADS } from '@/entities/lead'
import type { LeadStatus } from '@/entities/lead'
import styles from './DashboardPage.module.css'

// ── Mock analytics data ──────────────────────────────────────────────────────

const VISITS_30D = [
  42, 38, 51, 45, 60, 55, 30, 48, 52, 67, 71, 65, 58, 35, 53, 61, 74, 70, 68, 62, 28, 66, 78, 82,
  75, 91, 88, 45, 95, 87,
]
const LEADS_7D = [2, 1, 3, 0, 2, 4, 1]
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const TOTAL_MONTH = VISITS_30D.reduce((a, b) => a + b, 0)
const TODAY = VISITS_30D[VISITS_30D.length - 1]
const YESTERDAY = VISITS_30D[VISITS_30D.length - 2]
const DELTA_PCT = Math.round(((TODAY - YESTERDAY) / YESTERDAY) * 100)

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  }
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

// ── SVG Area Chart ────────────────────────────────────────────────────────────

function AreaChart({ data, color, gradId }: { data: number[]; color: string; gradId: string }) {
  const W = 500
  const H = 80
  const P = 3
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => [
    P + (i / (data.length - 1)) * (W - P * 2),
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

// ── CSS Bar Chart ─────────────────────────────────────────────────────────────

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

// ── Donut Chart (CSS conic-gradient) ─────────────────────────────────────────

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
  if (total === 0) return null
  const fP = (free / total) * 100
  const rP = (reserved / total) * 100
  const donutStyle = {
    background: `conic-gradient(
      #22c55e 0% ${fP.toFixed(1)}%,
      #f59e0b ${fP.toFixed(1)}% ${(fP + rP).toFixed(1)}%,
      #ef4444 ${(fP + rP).toFixed(1)}% 100%
    )`,
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

// ── Main Component ────────────────────────────────────────────────────────────

export function DashboardPage() {
  const params = useParams()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const totalRooms = MOCK_ROOMS.length
  const freeRooms = MOCK_ROOMS.filter((r) => r.status === 'FREE').length
  const reservedRooms = MOCK_ROOMS.filter((r) => r.status === 'RESERVED').length
  const rentedRooms = MOCK_ROOMS.filter((r) => r.status === 'RENTED').length

  const newLeads = MOCK_LEADS.filter((l) => l.status === 'NEW').length
  const inProgress = MOCK_LEADS.filter((l) => l.status === 'IN_PROGRESS').length
  const processed = MOCK_LEADS.filter((l) => l.status === 'PROCESSED').length
  const totalLeads = MOCK_LEADS.length

  const conversion = ((totalLeads / TOTAL_MONTH) * 100).toFixed(2)

  const recentLeads = [...MOCK_LEADS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  // X-axis labels for 30-day chart
  const xLabels = ['14 фев', '21 фев', '28 фев', '7 мар', '15 мар']

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Дашборд</h1>
          <p className={styles.subtitle}>15 марта 2026 · данные обновляются каждые 5 минут</p>
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
        {/* Посетители сегодня */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Посетители сегодня</span>
            <span
              className={`${styles.delta} ${DELTA_PCT >= 0 ? styles.deltaUp : styles.deltaDown}`}
            >
              {DELTA_PCT >= 0 ? '↑' : '↓'} {Math.abs(DELTA_PCT)}%
            </span>
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={VISITS_30D.slice(-7)} color="#8b5523" gradId="sp1" />
          </div>
          <div className={styles.kpiValue}>{TODAY}</div>
          <div className={styles.kpiMeta}>вчера: {YESTERDAY}</div>
        </div>

        {/* Посетители за месяц */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>За месяц</span>
            <span className={`${styles.delta} ${styles.deltaUp}`}>↑ 8%</span>
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={VISITS_30D} color="#6366f1" gradId="sp2" />
          </div>
          <div className={styles.kpiValue}>{TOTAL_MONTH.toLocaleString('ru-RU')}</div>
          <div className={styles.kpiMeta}>≈{Math.round(TOTAL_MONTH / 30)} в день</div>
        </div>

        {/* Заявки */}
        <div className={`${styles.kpiCard} ${newLeads > 0 ? styles.kpiCardAlert : ''}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Заявок за месяц</span>
            <span className={`${styles.delta} ${styles.deltaUp}`}>↑ 3</span>
          </div>
          <div className={styles.kpiSpark}>
            <AreaChart data={LEADS_7D} color="#22c55e" gradId="sp3" />
          </div>
          <div className={styles.kpiValue}>{totalLeads}</div>
          <div className={styles.kpiMeta}>
            {newLeads > 0 && <span className={styles.alertDot}>{newLeads} новых</span>}
            {inProgress > 0 && <span> · {inProgress} в работе</span>}
          </div>
        </div>

        {/* Конверсия */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Конверсия</span>
            <span className={`${styles.delta} ${styles.deltaUp}`}>↑ 0.1%</span>
          </div>
          <div className={styles.convValue}>{conversion}%</div>
          <div className={styles.convDesc}>заявок / посетителей</div>
          <div className={styles.convBar}>
            <div
              className={styles.convFill}
              style={{ width: `${Math.min(parseFloat(conversion) * 15, 100)}%` }}
            />
          </div>
          <div className={styles.kpiMeta}>
            {totalLeads} заявок из {TOTAL_MONTH} визитов
          </div>
        </div>
      </div>

      {/* ── Visit Chart ── */}
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <h2 className={styles.cardTitle}>Посещения сайта</h2>
            <p className={styles.cardDesc}>последние 30 дней</p>
          </div>
          <Link href={`${base}/analytics`} className={styles.cardLink}>
            Полная статистика →
          </Link>
        </div>
        <div className={styles.visitChart}>
          <div className={styles.yAxis}>
            {[Math.max(...VISITS_30D), Math.round(Math.max(...VISITS_30D) / 2), 0].map((v) => (
              <span key={v} className={styles.yTick}>
                {v}
              </span>
            ))}
          </div>
          <div className={styles.chartBody}>
            <div className={styles.chartSvg}>
              <AreaChart data={VISITS_30D} color="#8b5523" gradId="main" />
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

        {/* Leads 7d + funnel */}
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
          <BarChart data={LEADS_7D} labels={DAYS_SHORT} />
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
                      width: `${(val / totalLeads) * 100}%`,
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
