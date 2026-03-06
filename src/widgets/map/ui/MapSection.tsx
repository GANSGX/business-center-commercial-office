'use client'

import { useRef } from 'react'
import { useIntersection } from '@/shared/hooks/useIntersection'
import styles from './MapSection.module.css'

const MAP_EMBED_URL =
  'https://yandex.com/map-widget/v1/?ll=82.919235%2C55.023694&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzA5MjMxNBJV0KDQvtGB0YHQuNGPLCDQndC-0LLQvtGB0LjQsdC40YDRgdC6LCDQmtC-0LzQvNGD0L3QuNGB0YLQuNGH0LXRgdC60LDRjyDRg9C70LjRhtCwLCAzNSIKDSfXpUIVKBhcQg%2C%2C&pt=82.919659%2C55.030456&z=17'
const MAP_URL =
  'https://yandex.com/maps/65/novosibirsk/house/kommunisticheskaya_ulitsa_35/bEsYfwVgS0cEQFtvfXxzcnlrbQ==/'

const ADDRESS = '630007, г. Новосибирск, ул. Коммунистическая, 35'
const TRANSPORT =
  'Метро «Площадь Ленина» — 5–10 минут пешком\nОстановки автобусов — в 2 минутах от входа'

export function MapSection() {
  const { ref, isVisible } = useIntersection({ rootMargin: '200px', freezeOnceVisible: true })

  return (
    <section
      className={styles.section}
      aria-labelledby="map-title"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.inner}>
        {/* ── Левая колонка: инфо ── */}
        <div className={styles.info}>
          <span className={styles.badge}>Мы на карте</span>

          <h2 className={styles.title} id="map-title">
            Как нас найти
          </h2>

          <div className={styles.blocks}>
            {/* Адрес */}
            <div className={styles.block}>
              <span className={styles.blockIcon} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <p className={styles.blockLabel}>Адрес</p>
                <p className={styles.blockValue}>{ADDRESS}</p>
              </div>
            </div>

            {/* Транспорт */}
            <div className={styles.block}>
              <span className={styles.blockIcon} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <div>
                <p className={styles.blockLabel}>Транспортная доступность</p>
                {TRANSPORT.split('\n').map((line, i) => (
                  <p key={i} className={styles.blockValue}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Кнопка открыть в 2GIS */}
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openBtn}
            aria-label="Открыть адрес в Яндекс Картах"
          >
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
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Открыть в Яндекс Картах
          </a>
        </div>

        {/* ── Правая колонка: карта ── */}
        <div className={styles.mapWrap}>
          <div className={styles.mapFrame} aria-label="Карта расположения">
            {isVisible ? (
              <iframe
                src={MAP_EMBED_URL}
                className={styles.iframe}
                title="Расположение бизнес-центра на Яндекс Картах"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              /* Placeholder пока карта не в viewport */
              <div className={styles.mapPlaceholder} aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
