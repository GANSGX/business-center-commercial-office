'use client'

import React, { useState } from 'react'
import { MOCK_LEADS } from '@/entities/lead'
import type { Lead, LeadStatus } from '@/entities/lead'
import styles from './LeadsPage.module.css'

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  PROCESSED: 'Обработана',
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
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [filter, setFilter] = useState<'ALL' | LeadStatus>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const filtered = leads.filter((l) => {
    if (filter !== 'ALL' && l.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q)) return false
    }
    return true
  })

  const newCount = leads.filter((l) => l.status === 'NEW').length

  function changeStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    setOpenDropdownId(null)
  }

  function statusBadgeClass(status: LeadStatus) {
    if (status === 'NEW') return styles.statusNew
    if (status === 'IN_PROGRESS') return styles.statusInProgress
    return styles.statusDone
  }

  return (
    <div className={styles.page}>
      {openDropdownId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9 }}
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      {/* Заголовок */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Заявки
            {newCount > 0 && <span className={styles.newBadge}>{newCount} новых</span>}
          </h1>
          <p className={styles.subtitle}>Входящие обращения от посетителей</p>
        </div>
      </div>

      {/* Фильтры */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {(['ALL', 'NEW', 'IN_PROGRESS', 'PROCESSED'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'Все' : STATUS_LABELS[f]}
              <span className={styles.tabCount}>
                {f === 'ALL' ? leads.length : leads.filter((l) => l.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          placeholder="Поиск по имени или телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Таблица */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Помещение</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <React.Fragment key={lead.id}>
                <tr
                  className={`${styles.row} ${expanded === lead.id ? styles.rowExpanded : ''} ${lead.status === 'NEW' ? styles.rowNew : lead.status === 'IN_PROGRESS' ? styles.rowInProgress : ''}`}
                  onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                >
                  <td className={styles.dateCell}>{formatDateTime(lead.createdAt)}</td>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td className={styles.phoneCell}>{lead.phone}</td>
                  <td className={styles.mutedCell}>{lead.email ?? '—'}</td>
                  <td className={styles.mutedCell}>{lead.roomTitle ?? lead.serviceName ?? '—'}</td>
                  <td>
                    <div
                      className={styles.statusSelect}
                      style={{ position: 'relative', display: 'inline-block' }}
                    >
                      <span
                        className={`${styles.statusBadge} ${statusBadgeClass(lead.status)}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)
                        }}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                      {openDropdownId === lead.id && (
                        <div className={styles.statusDropdown} style={{ zIndex: 10 }}>
                          {(['NEW', 'IN_PROGRESS', 'PROCESSED'] as LeadStatus[]).map((s) => (
                            <button
                              key={s}
                              className={`${styles.statusOption} ${s === lead.status ? styles.statusOptionActive : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                changeStatus(lead.id, s)
                              }}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded === lead.id && lead.message && (
                  <tr key={`${lead.id}-msg`} className={styles.expandRow}>
                    <td colSpan={6}>
                      <div className={styles.messageBox}>
                        <span className={styles.messageLabel}>Сообщение:</span>
                        <p className={styles.messageText}>{lead.message}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  Заявок не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
