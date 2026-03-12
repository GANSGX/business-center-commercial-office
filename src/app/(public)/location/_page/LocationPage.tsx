import Link from 'next/link'
import { LocationHero } from './LocationHero'
import { LocationMap } from './LocationMap'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import styles from './LocationPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

function buildPlaceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: 'Бизнес-центр «Коммунистическая, 35»',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Коммунистическая, 35',
      addressLocality: 'Новосибирск',
      postalCode: '630007',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.030456,
      longitude: 82.919659,
    },
    url: `${BASE_URL}/location`,
    hasMap:
      'https://yandex.ru/maps/65/novosibirsk/house/kommunisticheskaya_ulitsa_35/bEsYfwVgS0cEQFtvfXxzcnlrbQ==/',
  }
}

export function LocationPage() {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Расположение', url: `${BASE_URL}/location` },
  ])

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPlaceSchema()) }}
      />

      <LocationHero />

      <div className={styles.panel}>
        <div className={styles.panelInner}>
          {/* ─── Карта ──────────────────────────────── */}
          <section id="location-content" className={styles.section} aria-labelledby="location-h2">
            <span className={styles.sectionLabel} aria-hidden="true">
              Интерактивная карта
            </span>
            <h2 id="location-h2" className={styles.sectionTitle}>
              Как нас найти
            </h2>
            <LocationMap />
          </section>

          {/* ─── Транспортные детали ──────────────────── */}
          <section className={styles.section} aria-labelledby="transport-h2">
            <span className={styles.sectionLabel} aria-hidden="true">
              Как добраться
            </span>
            <h2 id="transport-h2" className={styles.sectionTitle}>
              Транспортная доступность
            </h2>

            <div className={styles.transportGrid}>
              <div className={styles.transportCard}>
                <div className={styles.transportCardTop}>
                  <span className={styles.transportIcon} aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </span>
                  <h3 className={styles.transportCardTitle}>Наземный транспорт</h3>
                </div>
                <ul className={styles.transportList}>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Маршрутки и автобусы по ул. Советской — остановка в 100&nbsp;м
                  </li>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Троллейбус по Красному проспекту — 5 мин пешком
                  </li>
                </ul>
              </div>

              <div className={styles.transportCard}>
                <div className={styles.transportCardTop}>
                  <span className={styles.transportIcon} aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </span>
                  <h3 className={styles.transportCardTitle}>Метро</h3>
                </div>
                <ul className={styles.transportList}>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Станция «Площадь Ленина» (Ленинская линия) — 5–10 мин пешком
                  </li>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Выход № 2, далее по ул. Советской до пересечения с Коммунистической
                  </li>
                </ul>
              </div>

              <div className={styles.transportCard}>
                <div className={styles.transportCardTop}>
                  <span className={styles.transportIcon} aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
                      <rect x="9" y="11" width="14" height="10" rx="2" />
                      <circle cx="12" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                    </svg>
                  </span>
                  <h3 className={styles.transportCardTitle}>На автомобиле</h3>
                </div>
                <ul className={styles.transportList}>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Платная парковка прямо во дворе здания
                  </li>
                  <li className={styles.transportItem}>
                    <span className={styles.transportDot} aria-hidden="true" />
                    Городская платная парковка на ул. Коммунистической (вдоль тротуара)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ─── CTA ──────────────────────────────────── */}
          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Хотите осмотреть офис?</h2>
              <p className={styles.ctaText}>
                Организуем бесплатный показ в&nbsp;удобное время. Оставьте заявку&nbsp;— ответим
                в&nbsp;течение рабочего дня.
              </p>
            </div>
            <Link href="/contacts" className={styles.ctaBtn}>
              Оставить заявку
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
