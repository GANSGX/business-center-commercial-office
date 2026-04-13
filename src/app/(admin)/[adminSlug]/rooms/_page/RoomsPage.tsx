'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { RoomStatus } from '@/entities/room'
import styles from './RoomsPage.module.css'

interface Room {
  id: string
  title: string
  roomNumber?: string | null
  type?: string | null
  area: number
  floor: number
  status: RoomStatus
  priceMonth: number
  showOnHome: boolean
  photos: { id: string; url: string }[]
}

const ALL_STATUSES: RoomStatus[] = ['FREE', 'RESERVED', 'RENTED']

const STATUS_LABELS: Record<RoomStatus, string> = {
  FREE: 'Свободно',
  RESERVED: 'Забронировано',
  RENTED: 'Занято',
}

const STATUS_STYLES: Record<RoomStatus, string> = {
  FREE: styles.badgeFree,
  RESERVED: styles.badgeReserved,
  RENTED: styles.badgeRented,
}

const STATUS_COLORS: Record<RoomStatus, { bg: string; color: string }> = {
  FREE: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' },
  RESERVED: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  RENTED: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
}

function formatPrice(p: number) {
  return p.toLocaleString('ru-RU') + ' ₽'
}

export function RoomsPage() {
  const params = useParams()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const [rooms, setRooms] = useState<Room[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<RoomStatus | ''>('')
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams({ limit: '100' })
    if (filterStatus) p.set('status', filterStatus)
    const res = await fetch(`/api/rooms?${p}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setRooms(data.rooms)
      setTotal(data.total)
    }
    setLoading(false)
  }, [filterStatus])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const filtered = rooms.filter((r) => {
    if (filterType && r.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.title.toLowerCase().includes(q) && !(r.roomNumber ?? '').toLowerCase().includes(q))
        return false
    }
    return true
  })

  const types = Array.from(new Set(rooms.map((r) => r.type).filter(Boolean))) as string[]

  async function toggleShowOnHome(id: string, current: boolean) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, showOnHome: !current } : r)))
    await fetch('/api/rooms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, showOnHome: !current }),
    })
  }

  async function changeStatus(id: string, status: RoomStatus) {
    setOpenDropdownId(null)
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    await fetch('/api/rooms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
  }

  async function deleteRoom(id: string, title: string) {
    if (!confirm(`Удалить «${title}»? Действие нельзя отменить.`)) return
    setRooms((prev) => prev.filter((r) => r.id !== id))
    setTotal((t) => t - 1)
    await fetch('/api/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
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
          <h1 className={styles.title}>Помещения</h1>
          <p className={styles.subtitle}>{total} объектов в базе</p>
        </div>
        <Link href={`${base}/rooms/new`} className={styles.addBtn}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Добавить
        </Link>
      </div>

      {/* Фильтры */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по названию или номеру..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as RoomStatus | '')}
        >
          <option value="">Все статусы</option>
          <option value="FREE">Свободно</option>
          <option value="RESERVED">Забронировано</option>
          <option value="RENTED">Занято</option>
        </select>
        <select
          className={styles.select}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Все типы</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className={styles.count}>Показано: {filtered.length}</span>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Загрузка...
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Помещение</th>
                <th>Тип</th>
                <th>Площадь</th>
                <th>Этаж</th>
                <th>Статус</th>
                <th>Цена/мес</th>
                <th>На главной</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((room) => (
                <tr key={room.id}>
                  <td>
                    <div className={styles.roomCell}>
                      <div className={styles.roomThumb}>
                        {room.photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={room.photos[0].url} alt={room.title} />
                        ) : (
                          <div className={styles.roomThumbEmpty}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.roomInfo}>
                        <span className={styles.roomTitle}>{room.title}</span>
                        {room.roomNumber && (
                          <span className={styles.roomNumber}>№{room.roomNumber}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={styles.mutedCell}>{room.type ?? '—'}</td>
                  <td className={styles.mutedCell}>{room.area} м²</td>
                  <td className={styles.mutedCell}>{room.floor}</td>
                  <td>
                    <div className={styles.statusSelect}>
                      <span
                        className={`${styles.statusBadge} ${STATUS_STYLES[room.status]}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (openDropdownId === room.id) {
                            setOpenDropdownId(null)
                          } else {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                            setDropdownPos({ top: rect.bottom + 6, left: rect.left })
                            setOpenDropdownId(room.id)
                          }
                        }}
                      >
                        {STATUS_LABELS[room.status]}
                      </span>
                    </div>
                  </td>
                  <td className={styles.priceCell}>{formatPrice(room.priceMonth)}</td>
                  <td>
                    <button
                      className={`${styles.toggle} ${room.showOnHome ? styles.toggleOn : ''}`}
                      onClick={() => toggleShowOnHome(room.id, room.showOnHome)}
                      aria-label="Показывать на главной"
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`${base}/rooms/${room.id}`}
                        className={styles.actionBtn}
                        title="Редактировать"
                      >
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        title="Удалить"
                        onClick={() => deleteRoom(room.id, room.title)}
                      >
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    Помещений не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
            {ALL_STATUSES.map((s) => {
              const current = rooms.find((r) => r.id === openDropdownId)?.status
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
