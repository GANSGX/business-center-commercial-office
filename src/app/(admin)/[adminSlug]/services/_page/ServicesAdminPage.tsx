'use client'

import { useState } from 'react'
import styles from './ServicesAdminPage.module.css'

interface Service {
  id: string
  slug: string
  title: string
  priceText: string | null
  order: number
  optionsCount: number
}

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    slug: 'meeting-rooms',
    title: 'Переговорные комнаты',
    priceText: 'от 500 ₽/час',
    order: 0,
    optionsCount: 3,
  },
  {
    id: '2',
    slug: 'parking',
    title: 'Парковка',
    priceText: '3 000 ₽/мес',
    order: 1,
    optionsCount: 2,
  },
  {
    id: '3',
    slug: 'security',
    title: 'Охрана и пропускной режим',
    priceText: 'входит в аренду',
    order: 2,
    optionsCount: 0,
  },
  {
    id: '4',
    slug: 'cleaning',
    title: 'Клининг',
    priceText: 'от 2 000 ₽/уборка',
    order: 3,
    optionsCount: 4,
  },
  {
    id: '5',
    slug: 'internet',
    title: 'Интернет и телефония',
    priceText: 'от 1 500 ₽/мес',
    order: 4,
    optionsCount: 3,
  },
]

export function ServicesAdminPage() {
  const [services, setServices] = useState(MOCK_SERVICES)
  const [search, setSearch] = useState('')

  const filtered = services.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Услуги</h1>
          <p className={styles.subtitle}>{services.length} услуг</p>
        </div>
        <button className={styles.addBtn}>
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
          Добавить услугу
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по услугам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Название</th>
              <th>Slug</th>
              <th>Цена</th>
              <th>Опции</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              filtered.map((service) => (
                <tr key={service.id} className={styles.row}>
                  <td className={styles.dragCell}>
                    <div className={styles.dragHandle}>
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
                        <circle cx="9" cy="5" r="1" />
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="5" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <circle cx="15" cy="19" r="1" />
                      </svg>
                    </div>
                  </td>
                  <td className={styles.titleCell}>{service.title}</td>
                  <td className={styles.slugCell}>/{service.slug}</td>
                  <td className={styles.priceCell}>{service.priceText ?? '—'}</td>
                  <td className={styles.optionsCell}>
                    {service.optionsCount > 0 ? (
                      <span className={styles.optionsBadge}>{service.optionsCount} опц.</span>
                    ) : (
                      <span className={styles.mutedCell}>—</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="Редактировать">
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={() => removeService(service.id)}
                        title="Удалить"
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
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
