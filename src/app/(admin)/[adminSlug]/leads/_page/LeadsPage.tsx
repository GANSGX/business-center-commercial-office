'use client'

import { useState } from 'react'
import { MOCK_LEADS } from '@/entities/lead'
import type { Lead, LeadStatus } from '@/entities/lead'
import styles from './LeadsPage.module.css'

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

  const filtered = leads.filter((l) => {
    if (filter !== 'ALL' && l.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q)) return false
    }
    return true
  })

  const newCount = leads.filter((l) => l.status === 'NEW').length

  function toggleStatus(id: string) {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === 'NEW' ? 'PROCESSED' : 'NEW' } : l
      )
    )
  }

  return (
    <div className={styles.page}>
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
          {(['ALL', 'NEW', 'PROCESSED'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'Все' : f === 'NEW' ? 'Новые' : 'Обработанные'}
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  className={`${styles.row} ${expanded === lead.id ? styles.rowExpanded : ''} ${lead.status === 'NEW' ? styles.rowNew : ''}`}
                  onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                >
                  <td className={styles.dateCell}>{formatDateTime(lead.createdAt)}</td>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td className={styles.phoneCell}>{lead.phone}</td>
                  <td className={styles.mutedCell}>{lead.email ?? '—'}</td>
                  <td className={styles.mutedCell}>{lead.roomTitle ?? lead.serviceName ?? '—'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${lead.status === 'NEW' ? styles.statusNew : styles.statusDone}`}
                    >
                      {lead.status === 'NEW' ? 'Новая' : 'Обработана'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.actionBtn} ${lead.status === 'NEW' ? styles.actionBtnPrimary : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStatus(lead.id)
                      }}
                      title={lead.status === 'NEW' ? 'Отметить обработанной' : 'Вернуть в новые'}
                    >
                      {lead.status === 'NEW' ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
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
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
                {expanded === lead.id && lead.message && (
                  <tr key={`${lead.id}-msg`} className={styles.expandRow}>
                    <td colSpan={7}>
                      <div className={styles.messageBox}>
                        <span className={styles.messageLabel}>Сообщение:</span>
                        <p className={styles.messageText}>{lead.message}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
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
