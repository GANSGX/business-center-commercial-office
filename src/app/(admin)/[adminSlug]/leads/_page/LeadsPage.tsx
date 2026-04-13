'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { LeadStatus } from '@/entities/lead'
import styles from './LeadsPage.module.css'

interface Lead {
  id: string
  createdAt: string
  name: string
  phone: string
  email?: string | null
  message?: string | null
  roomId?: string | null
  serviceName?: string | null
  pageUrl?: string | null
  status: LeadStatus
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  PROCESSED: 'Обработана',
}

const STATUS_COLORS: Record<LeadStatus, { bg: string; color: string }> = {
  NEW: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  IN_PROGRESS: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  PROCESSED: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' },
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  )
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | LeadStatus>('ALL')
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

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/leads?${buildParams()}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads)
      setTotal(data.total)
    }
    setLoading(false)
  }, [buildParams])

  const silentRefresh = useCallback(async () => {
    const res = await fetch(`/api/leads?${buildParams()}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads)
      setTotal(data.total)
    }
  }, [buildParams])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // SSE — мгновенное обновление при новой заявке
  useEffect(() => {
    const es = new EventSource('/api/leads/stream')

    es.onmessage = (e) => {
      if (e.data === 'new-lead') silentRefresh()
    }

    // Переподключение при обрыве (браузер делает это сам, но добавим явный фоллбэк)
    es.onerror = () => {
      es.close()
      // Переподключимся через 5 сек
      setTimeout(() => {
        // Эффект пересоздастся при следующем рендере через window-событие
        window.dispatchEvent(new Event('sse-reconnect'))
      }, 5_000)
    }

    // Резервный поллинг раз в 60 сек на случай если SSE не работает (прокси и т.д.)
    const fallback = setInterval(silentRefresh, 60_000)

    return () => {
      es.close()
      clearInterval(fallback)
    }
  }, [silentRefresh])

  const newCount = leads.filter((l) => l.status === 'NEW').length

  async function changeStatus(id: string, status: LeadStatus) {
    setOpenDropdownId(null)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function deleteLead(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (!confirm('Удалить эту заявку? Действие необратимо.')) return
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setTotal((prev) => prev - 1)
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
  }

  function statusBadgeClass(status: LeadStatus) {
    if (status === 'NEW') return styles.statusNew
    if (status === 'IN_PROGRESS') return styles.statusInProgress
    return styles.statusDone
  }

  function statusDotClass(status: LeadStatus) {
    if (status === 'NEW') return styles.dotNew
    if (status === 'IN_PROGRESS') return styles.dotInProgress
    return styles.dotDone
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
            Заявки
            {newCount > 0 && <span className={styles.newBadge}>{newCount} новых</span>}
          </h1>
          <p className={styles.subtitle}>Всего: {total}</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {(['ALL', 'NEW', 'IN_PROGRESS', 'PROCESSED'] as const).map((f) => (
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
                {f === 'ALL' ? total : leads.filter((l) => l.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          placeholder="Поиск по имени или телефону..."
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
                <th>Имя</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Помещение / Услуга</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr
                    className={`${styles.row} ${expanded === lead.id ? styles.rowExpanded : ''} ${lead.status === 'NEW' ? styles.rowNew : lead.status === 'IN_PROGRESS' ? styles.rowInProgress : ''}`}
                    onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                  >
                    <td className={styles.dateCell}>{formatDateTime(lead.createdAt)}</td>
                    <td className={styles.nameCell}>{lead.name}</td>
                    <td className={styles.phoneCell}>{lead.phone}</td>
                    <td className={styles.mutedCell}>{lead.email ?? '—'}</td>
                    <td className={styles.mutedCell}>{lead.serviceName ?? '—'}</td>
                    <td>
                      <div
                        className={styles.statusSelect}
                        style={{ position: 'relative', display: 'inline-block' }}
                      >
                        <span
                          className={`${styles.statusBadge} ${statusBadgeClass(lead.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (openDropdownId === lead.id) {
                              setOpenDropdownId(null)
                            } else {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                              setDropdownPos({ top: rect.bottom + 6, left: rect.left })
                              setOpenDropdownId(lead.id)
                            }
                          }}
                        >
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </div>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteBtn}
                        title="Удалить заявку"
                        onClick={(e) => deleteLead(e, lead.id)}
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
                  {expanded === lead.id && (lead.message || lead.pageUrl) && (
                    <tr key={`${lead.id}-exp`} className={styles.expandRow}>
                      <td colSpan={7}>
                        <div className={styles.expandContent}>
                          {lead.pageUrl && (
                            <div className={styles.sourceRow}>
                              <span className={styles.messageLabel}>Источник:</span>
                              <a
                                href={lead.pageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.sourceLink}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.pageUrl}
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginLeft: 4, flexShrink: 0 }}
                                >
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            </div>
                          )}
                          {lead.message && (
                            <div className={styles.messageBox}>
                              <span className={styles.messageLabel}>Сообщение:</span>
                              <p className={styles.messageText}>{lead.message}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    Заявок не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Дропдаун статуса — рендерится через портал вне overflow-контейнера */}
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
            {(['NEW', 'IN_PROGRESS', 'PROCESSED'] as LeadStatus[]).map((s) => {
              const currentStatus = leads.find((l) => l.id === openDropdownId)?.status
              return (
                <button
                  key={s}
                  className={`${styles.statusOption} ${s === currentStatus ? styles.statusOptionActive : ''}`}
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
