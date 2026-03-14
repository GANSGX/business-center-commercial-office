'use client'

import { useState, useMemo, useEffect } from 'react'
import { RoomCard } from '@/widgets/room-card'
import { OfficesFilter } from './OfficesFilter'
import type { Room, RoomStatus } from '@/entities/room'
import type { RoomSortOption } from '@/entities/room'
import styles from './OfficesPage.module.css'

const STATUS_ORDER: Record<RoomStatus, number> = { FREE: 0, RESERVED: 1, RENTED: 2 }

interface Props {
  allRooms: Room[]
  initialStatus: string
  initialSort: string
  initialType: string
}

export function OfficesContent({ allRooms, initialStatus, initialSort, initialType }: Props) {
  const [activeStatus, setActiveStatus] = useState(initialStatus)
  const [activeSort, setActiveSort] = useState(initialSort)
  const [activeType, setActiveType] = useState(initialType)

  // Синхронизируем состояние если пропсы изменились (навигация с другими params)
  useEffect(() => {
    setActiveStatus(initialStatus)
  }, [initialStatus])
  useEffect(() => {
    setActiveSort(initialSort)
  }, [initialSort])
  useEffect(() => {
    setActiveType(initialType)
  }, [initialType])

  // Фильтрация + сортировка — без сервера, без мерцания
  const rooms = useMemo(() => {
    let result = [...allRooms]

    if (activeStatus) result = result.filter((r) => r.status === activeStatus)
    if (activeType) result = result.filter((r) => r.type === activeType)

    if (activeSort === 'price_asc') result.sort((a, b) => a.priceMonth - b.priceMonth)
    else if (activeSort === 'price_desc') result.sort((a, b) => b.priceMonth - a.priceMonth)
    else if (activeSort === 'area_asc') result.sort((a, b) => a.area - b.area)
    else if (activeSort === 'area_desc') result.sort((a, b) => b.area - a.area)
    else result.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

    return result
  }, [allRooms, activeStatus, activeSort, activeType])

  // URL sync без навигации — не триггерит ре-рендер Next.js
  function syncUrl(status: string, sort: string, type: string) {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (sort) params.set('sort', sort)
    if (type) params.set('type', type)
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }

  const handleStatus = (value: string) => {
    setActiveStatus(value)
    syncUrl(value, activeSort, activeType)
  }
  const handleType = (value: string) => {
    setActiveType(value)
    syncUrl(activeStatus, activeSort, value)
  }
  const handleSort = (value: RoomSortOption) => {
    setActiveSort(value)
    syncUrl(activeStatus, value, activeType)
  }

  return (
    <>
      <OfficesFilter
        activeStatus={activeStatus}
        activeSort={activeSort}
        activeType={activeType}
        total={allRooms.length}
        filtered={rooms.length}
        onStatus={handleStatus}
        onType={handleType}
        onSort={handleSort}
      />

      {rooms.length > 0 ? (
        <ul className={styles.grid} role="list" aria-label="Список офисов">
          {rooms.map((room, i) => (
            <li key={room.id}>
              <RoomCard room={room} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>Офисов не найдено</p>
          <p className={styles.emptyText}>Попробуйте изменить фильтры</p>
          <button
            type="button"
            className={styles.emptyReset}
            onClick={() => {
              setActiveStatus('')
              setActiveSort('')
              setActiveType('')
              syncUrl('', '', '')
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </>
  )
}
