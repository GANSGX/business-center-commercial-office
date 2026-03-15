'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_ROOMS } from '@/entities/room'
import type { Room, RoomStatus } from '@/entities/room'
import styles from './RoomsPage.module.css'

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

function formatPrice(p: number) {
  return p.toLocaleString('ru-RU') + ' ₽'
}

export function RoomsPage() {
  const params = useParams()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const [filterStatus, setFilterStatus] = useState<RoomStatus | ''>('')
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const filtered = rooms.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false
    if (filterType && r.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.title.toLowerCase().includes(q) && !(r.roomNumber ?? '').toLowerCase().includes(q))
        return false
    }
    return true
  })

  const types = Array.from(new Set(rooms.map((r) => r.type).filter(Boolean))) as string[]

  function toggleShowOnHome(id: string) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, showOnHome: !r.showOnHome } : r)))
  }

  function changeStatus(id: string, status: RoomStatus) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    setOpenDropdownId(null)
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
          <p className={styles.subtitle}>{rooms.length} объектов в базе</p>
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

      {/* Таблица */}
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
                        setOpenDropdownId(openDropdownId === room.id ? null : room.id)
                      }}
                    >
                      {STATUS_LABELS[room.status]}
                    </span>
                    {openDropdownId === room.id && (
                      <div className={styles.statusDropdown} style={{ zIndex: 10 }}>
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            className={`${styles.statusOption} ${s === room.status ? styles.statusOptionActive : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              changeStatus(room.id, s)
                            }}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className={styles.priceCell}>{formatPrice(room.priceMonth)}</td>
                <td>
                  <button
                    className={`${styles.toggle} ${room.showOnHome ? styles.toggleOn : ''}`}
                    onClick={() => toggleShowOnHome(room.id)}
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
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
