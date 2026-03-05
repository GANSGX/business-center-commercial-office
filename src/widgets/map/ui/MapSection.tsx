'use client'

import { useRef } from 'react'
import { useIntersection } from '@/shared/hooks/useIntersection'
import styles from './MapSection.module.css'

// Координаты и зум берутся из SiteSettings (через пропсы).
// TODO Sprint 2: подключить реальные данные из /api/settings
// Заглушка — ул. Коммунистическая, 35, Новосибирск
const MAP_LAT = '55.030456'
const MAP_LNG = '82.919659'
const MAP_ZOOM = '16'

const ADDRESS = 'ул. Коммунистическая, 35, Новосибирск'
const TRANSPORT =
  'Остановка «Коммунистическая» — автобусы № ...\nДо центра города — 5 минут на транспорте'

function get2GISUrl(lat: string, lng: string, zoom: string) {
  return `https://2gis.ru/novosibirsk/geo/${lng},${lat}?m=${lng},${lat}/${zoom}`
}

export function MapSection() {
  const { ref, isVisible } = useIntersection({ rootMargin: '200px', freezeOnceVisible: true })

  const mapUrl = get2GISUrl(MAP_LAT, MAP_LNG, MAP_ZOOM)

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
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openBtn}
            aria-label="Открыть адрес в 2GIS"
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
            Открыть в 2GIS
          </a>
        </div>

        {/* ── Правая колонка: карта ── */}
        <div className={styles.mapWrap}>
          <div className={styles.mapFrame} aria-label="Карта расположения">
            {isVisible ? (
              <iframe
                src={`https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A${MAP_LAT}%2C%22lon%22%3A${MAP_LNG}%2C%22zoom%22%3A${MAP_ZOOM}%7D%7D`}
                className={styles.iframe}
                title="Расположение бизнес-центра на карте 2GIS"
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
