'use client'

import Link from 'next/link'
import { useLeadModal } from '@/features/lead-submit'
import { useState, useEffect } from 'react'
import styles from './OffersPreview.module.css'

interface Office {
  id: string
  slug: string
  roomNumber?: string | null
  title: string
  area: number
  floor: number
  layoutType?: string | null
  water: boolean
  priceMonth: number
  status: string
  photos: { url: string }[]
}

function formatPrice(price: number) {
  return price.toLocaleString('ru-RU') + '\u00a0₽/мес'
}

function formatArea(area: number) {
  return area.toFixed(1).replace('.', ',') + '\u00a0м²'
}

export function OffersPreview() {
  const { open } = useLeadModal()
  const [offices, setOffices] = useState<Office[] | null>(null)

  useEffect(() => {
    fetch('/api/rooms?showOnHome=true&status=FREE&limit=6', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { rooms: [] }))
      .then((data) => setOffices(data.rooms ?? []))
  }, [])

  return (
    <section className={styles.section} id="offers">
      <div className={styles.inner}>
        {/* Шапка секции */}
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadText}>
            <span className={styles.sectionLabel}>Прямо сейчас</span>
            <h2 className={styles.sectionTitle}>Актуальные предложения</h2>
            <p className={styles.sectionSubtitle}>
              Свободные офисы в нашем бизнес-центре — выберите подходящий и оставьте заявку
            </p>
          </div>
          <Link href="/offices" className={styles.allLink}>
            Все офисы
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Сетка карточек */}
        {offices === null && <div className={styles.emptyState}>Загрузка...</div>}
        {offices !== null && offices.length === 0 && (
          <div className={styles.emptyState}>
            Свободных офисов пока нет — следите за обновлениями
          </div>
        )}
        <div className={styles.grid}>
          {(offices ?? []).map((office) => {
            const num = office.roomNumber
            const photo = office.photos?.[0]?.url ?? null
            const label = `Офис${num ? ` ${num}` : ''}, ${formatArea(office.area)}`
            return (
              <article key={office.id} className={styles.card} aria-label={label}>
                <div className={styles.cardPhoto}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={label} className={styles.photoImg} loading="lazy" />
                  ) : (
                    <div className={styles.photoPlaceholder} aria-hidden="true" />
                  )}
                  <span className={styles.statusBadge}>Свободен</span>
                  <span className={styles.floorBadge}>{office.floor} этаж</span>
                </div>

                <div className={styles.cardBody}>
                  <Link href={`/offices/${office.slug}`} className={styles.cardTitle}>
                    Офис, {formatArea(office.area)}
                  </Link>

                  <dl className={styles.details}>
                    {num && (
                      <div className={styles.detailRow}>
                        <dt className={styles.detailLabel}>Номер офиса</dt>
                        <dd className={styles.detailValue}>{num}</dd>
                      </div>
                    )}
                    <div className={styles.detailRow}>
                      <dt className={styles.detailLabel}>Площадь</dt>
                      <dd className={styles.detailValue}>{formatArea(office.area)}</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt className={styles.detailLabel}>Этаж</dt>
                      <dd className={styles.detailValue}>{office.floor}</dd>
                    </div>
                    {office.layoutType && (
                      <div className={styles.detailRow}>
                        <dt className={styles.detailLabel}>Планировка</dt>
                        <dd className={styles.detailValue}>{office.layoutType}</dd>
                      </div>
                    )}
                    <div className={styles.detailRow}>
                      <dt className={styles.detailLabel}>Вода в офисе</dt>
                      <dd className={styles.detailValue}>{office.water ? 'Есть' : 'Нет'}</dd>
                    </div>
                  </dl>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceWrap}>
                      <span className={styles.priceLabel}>от</span>
                      <span className={styles.price}>{formatPrice(office.priceMonth)}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.ctaBtn}
                      aria-label={`Оставить заявку на ${label}`}
                      onClick={() => open(label)}
                    >
                      Оставить заявку
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
