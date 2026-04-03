'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './TenantRequestsPage.module.css'

type Status = 'NEW' | 'PROCESSED' | 'APPROVED' | 'REJECTED'

interface TenantRequest {
  id: string
  createdAt: string
  companyName: string
  category: string
  floor: number | null
  description: string | null
  contactName: string
  phone: string
  email: string | null
  status: Status
}

const STATUS_LABELS: Record<Status, string> = {
  NEW: 'Новая',
  PROCESSED: 'В работе',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

const BADGE_CLASSES: Record<Status, string> = {
  NEW: styles.badgeNew,
  PROCESSED: styles.badgeProcessed,
  APPROVED: styles.badgeApproved,
  REJECTED: styles.badgeRejected,
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Кафе / еда',
  service: 'Услуги',
  retail: 'Магазин',
  bank: 'Банк',
  other: 'Другое',
}

const FILTERS: { value: 'ALL' | Status; label: string }[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'NEW', label: 'Новые' },
  { value: 'PROCESSED', label: 'В работе' },
  { value: 'APPROVED', label: 'Одобрены' },
  { value: 'REJECTED', label: 'Отклонены' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TenantRequestsPage() {
  const [items, setItems] = useState<TenantRequest[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | Status>('ALL')
  const [page, setPage] = useState(1)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (filter !== 'ALL') params.set('status', filter)
      const res = await fetch(`/api/tenant-requests?${params}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function changeStatus(id: string, status: Status) {
    await fetch(`/api/tenant-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchItems()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Заявки арендаторов</h1>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`}
              onClick={() => {
                setFilter(f.value)
                setPage(1)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.empty}>Загрузка...</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>Заявок нет</div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Status */}
              <div className={styles.cardStatus}>
                <span className={styles.tenantMark} aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <span className={`${styles.badge} ${BADGE_CLASSES[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.companyName}>{item.companyName}</span>
                  <span className={styles.categoryBadge}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    {item.contactName}
                  </span>

                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <a href={`tel:${item.phone}`}>{item.phone}</a>
                  </span>

                  {item.email && (
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </span>
                  )}

                  {item.floor && (
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                      </span>
                      Этаж {item.floor}
                    </span>
                  )}
                </div>

                {item.description && <div className={styles.cardDesc}>{item.description}</div>}

                <div className={styles.cardDate}>{formatDate(item.createdAt)}</div>
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                {item.status === 'NEW' && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnApprove}`}
                    onClick={() => changeStatus(item.id, 'APPROVED')}
                  >
                    Одобрить
                  </button>
                )}
                {item.status === 'NEW' && (
                  <button
                    className={styles.actionBtn}
                    onClick={() => changeStatus(item.id, 'PROCESSED')}
                  >
                    В работу
                  </button>
                )}
                {item.status === 'PROCESSED' && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnApprove}`}
                    onClick={() => changeStatus(item.id, 'APPROVED')}
                  >
                    Одобрить
                  </button>
                )}
                {(item.status === 'NEW' || item.status === 'PROCESSED') && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnReject}`}
                    onClick={() => changeStatus(item.id, 'REJECTED')}
                  >
                    Отклонить
                  </button>
                )}
                {(item.status === 'APPROVED' || item.status === 'REJECTED') && (
                  <button className={styles.actionBtn} onClick={() => changeStatus(item.id, 'NEW')}>
                    Вернуть
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Назад
          </button>
          <span className={styles.pageInfo}>
            {page} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  )
}
