'use client'

import { useIntersection } from '@/shared/hooks/useIntersection'
import styles from './LocationPage.module.css'

const MAP_EMBED_URL =
  'https://yandex.com/map-widget/v1/?ll=82.919235%2C55.023694&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzA5MjMxNBJV0KDQvtGB0YHQuNGPLCDQndC-0LLQvtGB0LjQsdC40YDRgdC6LCDQmtC-0LzQvNGD0L3QuNGB0YLQuNGH0LXRgdC60LDRjyDRg9C70LjRhtCwLCAzNSIKDSfXpUIVKBhcQg%2C%2C&pt=82.919659%2C55.030456&z=17'
const MAP_URL =
  'https://yandex.com/maps/65/novosibirsk/house/kommunisticheskaya_ulitsa_35/bEsYfwVgS0cEQFtvfXxzcnlrbQ==/'

export function LocationMap() {
  const { ref, isVisible } = useIntersection({ rootMargin: '200px', freezeOnceVisible: true })

  return (
    <div className={styles.mapLayout}>
      {/* ── Левая колонка: инфо ── */}
      <div className={styles.mapInfo}>
        <div className={styles.mapBlocks}>
          <div className={styles.mapBlock}>
            <span className={styles.mapBlockIcon} aria-hidden="true">
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div>
              <p className={styles.mapBlockLabel}>Адрес</p>
              <p className={styles.mapBlockValue}>
                630007, г.&nbsp;Новосибирск,
                <br />
                ул.&nbsp;Коммунистическая,&nbsp;35
              </p>
            </div>
          </div>

          <div className={styles.mapBlock}>
            <span className={styles.mapBlockIcon} aria-hidden="true">
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
              <p className={styles.mapBlockLabel}>Транспорт</p>
              <p className={styles.mapBlockValue}>Метро «Площадь Ленина» — 5–10 мин пешком</p>
              <p className={styles.mapBlockValue}>Остановки автобусов — 2 мин от входа</p>
            </div>
          </div>

          <div className={styles.mapBlock}>
            <span className={styles.mapBlockIcon} aria-hidden="true">
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
                <rect x="1" y="6" width="3" height="13" />
                <path d="M4 7h3v3H4zm0 6h3v3H4z" />
                <rect x="8" y="6" width="3" height="13" />
                <path d="M12 6h9v13H12z" />
                <path d="M15 9h2m-2 3h2m-2 3h2" />
              </svg>
            </span>
            <div>
              <p className={styles.mapBlockLabel}>Парковка</p>
              <p className={styles.mapBlockValue}>Платная парковка во дворе здания</p>
              <p className={styles.mapBlockValue}>Городская парковка на ул. Коммунистической</p>
            </div>
          </div>
        </div>

        <a
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapOpenBtn}
          aria-label="Открыть адрес в Яндекс Картах (откроется в новой вкладке)"
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
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Открыть в Яндекс Картах
        </a>
      </div>

      {/* ── Правая колонка: карта ── */}
      <div
        className={styles.mapFrame}
        ref={ref as React.RefObject<HTMLDivElement>}
        aria-label="Интерактивная карта расположения бизнес-центра"
      >
        {isVisible ? (
          <iframe
            src={MAP_EMBED_URL}
            className={styles.mapIframe}
            title="Расположение бизнес-центра Коммунистическая, 35 на Яндекс Картах"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
