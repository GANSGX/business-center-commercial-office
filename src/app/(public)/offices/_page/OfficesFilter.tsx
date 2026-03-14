'use client'

import type { RoomStatus, RoomSortOption } from '@/entities/room'
import styles from './OfficesPage.module.css'

const STATUS_TABS: { value: RoomStatus | ''; label: string; dot?: 'green' | 'amber' | 'red' }[] = [
  { value: '', label: 'Все' },
  { value: 'FREE', label: 'Свободен', dot: 'green' },
  { value: 'RESERVED', label: 'Забронирован', dot: 'amber' },
  { value: 'RENTED', label: 'Занят', dot: 'red' },
]

const TYPE_TABS = [
  { value: '', label: 'Все' },
  { value: 'Офис', label: 'Офис' },
  { value: 'Склад', label: 'Склад' },
]

function togglePrice(current: string): RoomSortOption {
  if (current === 'price_asc') return 'price_desc'
  if (current === 'price_desc') return ''
  return 'price_asc'
}

function toggleArea(current: string): RoomSortOption {
  if (current === 'area_asc') return 'area_desc'
  if (current === 'area_desc') return ''
  return 'area_asc'
}

interface Props {
  activeStatus: string
  activeSort: string
  activeType: string
  total: number
  filtered: number
  onStatus: (value: string) => void
  onType: (value: string) => void
  onSort: (value: RoomSortOption) => void
}

function SortArrow({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (direction === 'asc') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    )
  }
  if (direction === 'desc') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.arrowNeutral}
    >
      <polyline points="6 9 12 6 18 9" />
      <polyline points="6 15 12 18 18 15" />
    </svg>
  )
}

export function OfficesFilter({
  activeStatus,
  activeSort,
  activeType,
  total,
  filtered,
  onStatus,
  onType,
  onSort,
}: Props) {
  const priceDir = activeSort === 'price_asc' ? 'asc' : activeSort === 'price_desc' ? 'desc' : null
  const areaDir = activeSort === 'area_asc' ? 'asc' : activeSort === 'area_desc' ? 'desc' : null

  return (
    <div className={styles.filterWrap} role="search" aria-label="Фильтры офисов">
      {/* ── Строка 1: тип ── */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup} role="group" aria-label="Тип помещения">
          <span className={styles.filterGroupLabel}>Тип</span>
          <div className={styles.statusTabs}>
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`${styles.statusTab} ${styles.tabAll} ${activeType === tab.value ? styles.statusTabActive : ''}`}
                onClick={() => onType(tab.value)}
                aria-pressed={activeType === tab.value}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <span className={styles.filterCount} aria-live="polite">
          {filtered === total ? `${total} помещений` : `${filtered} из ${total}`}
        </span>
      </div>

      {/* ── Строка 2: статус ── */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup} role="group" aria-label="Статус">
          <span className={styles.filterGroupLabel}>Статус</span>
          <div className={styles.statusTabs}>
            {STATUS_TABS.map((tab) => {
              const isActive = tab.value === activeStatus
              return (
                <button
                  key={tab.value}
                  type="button"
                  className={`${styles.statusTab} ${isActive ? styles.statusTabActive : ''} ${
                    tab.value === 'FREE'
                      ? styles.tabFree
                      : tab.value === 'RESERVED'
                        ? styles.tabReserved
                        : tab.value === 'RENTED'
                          ? styles.tabRented
                          : styles.tabAll
                  }`}
                  onClick={() => onStatus(tab.value)}
                  aria-pressed={isActive}
                >
                  {tab.dot && (
                    <span
                      className={`${styles.tabDot} ${
                        tab.dot === 'green'
                          ? styles.dotGreen
                          : tab.dot === 'amber'
                            ? styles.dotAmber
                            : styles.dotRed
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Строка 3: сортировка ── */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup} role="group" aria-label="Сортировка">
          <span className={styles.filterGroupLabel}>Сортировка</span>
          <div className={styles.sortTabs}>
            <button
              type="button"
              className={`${styles.sortTab} ${styles.tabAll} ${activeSort === '' ? styles.sortTabActive : ''}`}
              onClick={() => onSort('')}
              aria-pressed={activeSort === ''}
            >
              По умолчанию
            </button>

            <button
              type="button"
              className={`${styles.sortTab} ${priceDir ? styles.sortTabActive : ''}`}
              onClick={() => onSort(togglePrice(activeSort))}
              aria-label={`Сортировка по цене${priceDir === 'asc' ? ': по возрастанию' : priceDir === 'desc' ? ': по убыванию' : ''}`}
            >
              Цена
              <SortArrow direction={priceDir} />
            </button>

            <button
              type="button"
              className={`${styles.sortTab} ${areaDir ? styles.sortTabActive : ''}`}
              onClick={() => onSort(toggleArea(activeSort))}
              aria-label={`Сортировка по площади${areaDir === 'asc' ? ': по возрастанию' : areaDir === 'desc' ? ': по убыванию' : ''}`}
            >
              Площадь
              <SortArrow direction={areaDir} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
