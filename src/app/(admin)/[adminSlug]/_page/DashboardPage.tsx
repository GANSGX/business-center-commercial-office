'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_ROOMS } from '@/entities/room'
import { MOCK_LEADS } from '@/entities/lead'
import styles from './DashboardPage.module.css'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function DashboardPage() {
  const params = useParams()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const totalRooms = MOCK_ROOMS.length
  const freeRooms = MOCK_ROOMS.filter((r) => r.status === 'FREE').length
  const reservedRooms = MOCK_ROOMS.filter((r) => r.status === 'RESERVED').length
  const rentedRooms = MOCK_ROOMS.filter((r) => r.status === 'RENTED').length
  const totalLeads = MOCK_LEADS.length
  const newLeads = MOCK_LEADS.filter((l) => l.status === 'NEW').length
  const recentLeads = [...MOCK_LEADS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Дашборд</h1>
          <p className={styles.subtitle}>Обзор состояния объекта</p>
        </div>
      </div>

      {/* Статистика */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="blue">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className={styles.statValue}>{totalRooms}</div>
          <div className={styles.statLabel}>Всего помещений</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="green">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className={styles.statValue} data-color="green">
            {freeRooms}
          </div>
          <div className={styles.statLabel}>Свободно</div>
          <div className={styles.statSub}>
            {reservedRooms} забронировано · {rentedRooms} занято
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="amber">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className={styles.statValue}>{totalLeads}</div>
          <div className={styles.statLabel}>Всего заявок</div>
        </div>

        <div className={`${styles.statCard} ${newLeads > 0 ? styles.statCardAccent : ''}`}>
          <div className={styles.statIcon} data-color="red">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className={styles.statValue} data-color="red">
            {newLeads}
          </div>
          <div className={styles.statLabel}>Новых заявок</div>
          <div className={styles.statSub}>Требуют обработки</div>
        </div>
      </div>

      {/* Последние заявки */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние заявки</h2>
          <Link href={`${base}/leads`} className={styles.sectionLink}>
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
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <span className={styles.dateCell}>
                      <span>{formatDate(lead.createdAt)}</span>
                      <span className={styles.time}>{formatTime(lead.createdAt)}</span>
                    </span>
                  </td>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td className={styles.phoneCell}>{lead.phone}</td>
                  <td className={styles.mutedCell}>{lead.roomTitle ?? lead.serviceName ?? '—'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${lead.status === 'NEW' ? styles.statusNew : styles.statusDone}`}
                    >
                      {lead.status === 'NEW' ? 'Новая' : 'Обработана'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        <div className={styles.actionsGrid}>
          <Link href={`${base}/rooms/new`} className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <line x1="12" y1="22" x2="12" y2="12" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
            </div>
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Добавить помещение</span>
              <span className={styles.actionSub}>Офис или склад</span>
            </div>
          </Link>
          <Link href={`${base}/gallery`} className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Галерея</span>
              <span className={styles.actionSub}>Управление фотографиями</span>
            </div>
          </Link>
          <Link href={`${base}/hero-slides`} className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3H8" />
                <path d="M12 3v4" />
              </svg>
            </div>
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Слайдер</span>
              <span className={styles.actionSub}>Баннеры главной страницы</span>
            </div>
          </Link>
          <Link href={`${base}/settings`} className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Настройки</span>
              <span className={styles.actionSub}>Контакты, реквизиты</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
