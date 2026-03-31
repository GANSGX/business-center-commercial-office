'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './InBuildingPage.module.css'
import type { BuildingOrgItem } from './InBuildingPage'

const CATEGORY_TITLES: Record<string, string> = {
  food: 'Кафе и рестораны',
  service: 'Услуги и сервисы',
  retail: 'Магазины',
  bank: 'Финансы',
  other: 'Другое',
}

const CATEGORY_ORDER = ['food', 'service', 'retail', 'bank', 'other']

const VALID_COLORS = ['amber', 'blue', 'green', 'purple', 'red', 'teal', 'indigo', 'orange']

// camelCase to match CSS module class names (.colorAmber, .colorBlue, etc.)
function colorClass(color: string): string {
  const c = color.charAt(0).toUpperCase() + color.slice(1)
  return VALID_COLORS.includes(color) ? `color${c}` : 'colorBlue'
}

// Public-page icons — lifestyle/illustrative style, distinct from admin UI icons
function CategoryIcon({ category }: { category: string }) {
  if (category === 'food') {
    // Fork & knife
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 .55.45 1 1 1h3m0 0v5" />
      </svg>
    )
  }
  if (category === 'service') {
    // Wrench + sparkle
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  }
  if (category === 'retail') {
    // Price tag
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    )
  }
  if (category === 'bank') {
    // Bank / columns
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    )
  }
  // other — compass
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

interface Props {
  initialOrgs: BuildingOrgItem[]
}

export function InBuildingLiveList({ initialOrgs }: Props) {
  const [orgs, setOrgs] = useState<BuildingOrgItem[]>(initialOrgs)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [])

  useEffect(() => {
    let es: EventSource | null = null
    let destroyed = false

    function connect() {
      if (destroyed) return
      es = new EventSource('/api/building-orgs/stream')

      es.addEventListener('message', (e) => {
        if (e.data === 'orgs-updated') {
          fetch('/api/building-orgs')
            .then((r) => r.json())
            .then((data: BuildingOrgItem[]) => {
              if (!destroyed) setOrgs(data)
            })
            .catch(() => {
              /* silent */
            })
        }
      })

      es.onerror = () => {
        es?.close()
        if (!destroyed) {
          retryRef.current = setTimeout(connect, 5000)
        }
      }
    }

    connect()

    return () => {
      destroyed = true
      es?.close()
      if (retryRef.current) clearTimeout(retryRef.current)
    }
  }, [])

  const grouped: Record<string, BuildingOrgItem[]> = {}
  for (const org of orgs) {
    if (!grouped[org.category]) grouped[org.category] = []
    grouped[org.category].push(org)
  }

  const categories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0)

  if (orgs.length === 0) {
    return <p className={styles.empty}>Список организаций пока пуст.</p>
  }

  return (
    <>
      {categories.map((cat) => (
        <section key={cat} className={styles.section}>
          <span className={styles.sectionLabel} aria-hidden="true">
            {CATEGORY_TITLES[cat] ?? cat}
          </span>

          <div className={styles.grid}>
            {grouped[cat].map((org) => (
              <div
                key={org.id}
                id={`org-${org.id}`}
                className={`${styles.card} ${styles[colorClass(org.color)]}`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <CategoryIcon category={org.category} />
                  </div>
                  <span className={styles.cardFloor}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {org.floor}&nbsp;этаж
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{org.name}</h3>
                  {org.description && <p className={styles.cardDesc}>{org.description}</p>}
                  {(org.website || org.contact) && <div className={styles.cardDivider} />}
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardWebsiteBtn}
                    >
                      <span>Перейти на сайт организации</span>
                      <span className={styles.cardWebsiteBtnArrow}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                    </a>
                  )}
                  {org.contact && (
                    <a
                      href={
                        org.contact.includes('@')
                          ? `mailto:${org.contact}`
                          : `tel:${org.contact.replace(/[\s\-()]/g, '')}`
                      }
                      className={styles.cardContact}
                    >
                      <span className={styles.cardContactIcon}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <span className={styles.cardContactLabel}>Контакт</span>
                      <span className={styles.cardContactValue}>{org.contact}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
