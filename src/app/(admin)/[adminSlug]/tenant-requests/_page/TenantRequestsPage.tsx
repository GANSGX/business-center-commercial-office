'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

const STATUS_COLORS: Record<Status, { bg: string; color: string }> = {
  NEW: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  PROCESSED: { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' },
  APPROVED: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' },
  REJECTED: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' },
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Кафе',
  service: 'Услуги',
  retail: 'Магазин',
  bank: 'Банк',
  other: 'Другое',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  )
}

export function TenantRequestsPage() {
  const [items, setItems] = useState<TenantRequest[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | Status>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const buildParams = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (filter !== 'ALL') params.set('status', filter)
    if (search) params.set('search', search)
    return params
  }, [filter, search, page])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/tenant-requests?${buildParams()}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    }
    setLoading(false)
  }, [buildParams])

  const silentRefresh = useCallback(async () => {
    const res = await fetch(`/api/tenant-requests?${buildParams()}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    }
  }, [buildParams])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    const es = new EventSource('/api/tenant-requests/stream')

    es.onmessage = (e) => {
      if (e.data === 'new-tenant-request') silentRefresh()
    }

    es.onerror = () => {
      es.close()
      setTimeout(() => {
        window.dispatchEvent(new Event('sse-reconnect'))
      }, 5_000)
    }

    const fallback = setInterval(silentRefresh, 60_000)

    return () => {
      es.close()
      clearInterval(fallback)
    }
  }, [silentRefresh])

  const newCount = items.filter((i) => i.status === 'NEW').length

  async function changeStatus(id: string, status: Status) {
    setOpenDropdownId(null)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    await fetch(`/api/tenant-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function deleteItem(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (!confirm('Удалить заявку? Действие необратимо.')) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    setTotal((prev) => prev - 1)
    await fetch(`/api/tenant-requests/${id}`, { method: 'DELETE' })
  }

  function statusBadgeClass(status: Status) {
    if (status === 'NEW') return styles.statusNew
    if (status === 'PROCESSED') return styles.statusProcessed
    if (status === 'APPROVED') return styles.statusApproved
    return styles.statusRejected
  }

  function rowClass(status: Status) {
    if (status === 'NEW') return styles.rowNew
    if (status === 'PROCESSED') return styles.rowProcessed
    if (status === 'APPROVED') return styles.rowApproved
    return styles.rowRejected
  }

  return (
    <div className={styles.page}>
      {openDropdownId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9 }}
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Заявки арендаторов
            {newCount > 0 && <span className={styles.newBadge}>{newCount} новых</span>}
          </h1>
          <p className={styles.subtitle}>Всего: {total}</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {(['ALL', 'NEW', 'PROCESSED', 'APPROVED', 'REJECTED'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
              onClick={() => {
                setFilter(f)
                setPage(1)
              }}
            >
              {f === 'ALL' ? 'Все' : STATUS_LABELS[f]}
              <span className={styles.tabCount}>
                {f === 'ALL' ? total : items.filter((i) => i.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          placeholder="Поиск по компании или телефону..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {loading ? (
        <div className={styles.emptyRow} style={{ padding: '3rem', textAlign: 'center' }}>
          Загрузка...
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Компания</th>
                <th>Категория</th>
                <th>Контакт</th>
                <th>Email</th>
                <th>Этаж</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    className={`${styles.row} ${rowClass(item.status)} ${expanded === item.id ? styles.rowExpanded : ''}`}
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  >
                    <td className={styles.dateCell}>{formatDateTime(item.createdAt)}</td>
                    <td className={styles.companyCell}>{item.companyName}</td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                    </td>
                    <td className={styles.contactCell}>
                      <span className={styles.contactName}>{item.contactName}</span>
                      <span className={styles.contactPhone}>{item.phone}</span>
                    </td>
                    <td className={styles.mutedCell}>{item.email ?? '—'}</td>
                    <td className={styles.mutedCell}>{item.floor ?? '—'}</td>
                    <td>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <span
                          className={`${styles.statusBadge} ${statusBadgeClass(item.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (openDropdownId === item.id) {
                              setOpenDropdownId(null)
                            } else {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                              setDropdownPos({ top: rect.bottom + 6, left: rect.left })
                              setOpenDropdownId(item.id)
                            }
                          }}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                      </div>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteBtn}
                        title="Удалить заявку"
                        onClick={(e) => deleteItem(e, item.id)}
                      >
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expanded === item.id && item.description && (
                    <tr key={`${item.id}-exp`} className={styles.expandRow}>
                      <td colSpan={8}>
                        <div className={styles.expandContent}>
                          <div className={styles.descBox}>
                            <span className={styles.descLabel}>Описание деятельности:</span>
                            <p className={styles.descText}>{item.description}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    Заявок не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Дропдаун статуса через портал */}
      {openDropdownId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.statusDropdown}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(['NEW', 'PROCESSED', 'APPROVED', 'REJECTED'] as Status[]).map((s) => {
              const current = items.find((i) => i.id === openDropdownId)?.status
              return (
                <button
                  key={s}
                  className={`${styles.statusOption} ${s === current ? styles.statusOptionActive : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    changeStatus(openDropdownId, s)
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: STATUS_COLORS[s].bg,
                      color: STATUS_COLORS[s].color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </span>
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </div>
  )
}
