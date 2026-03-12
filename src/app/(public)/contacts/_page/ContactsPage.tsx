import { ContactsHero } from './ContactsHero'
import { LeadForm } from '@/widgets/lead-form'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import styles from './ContactsPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'АО «Коммунистическая-35»',
    legalName: 'Акционерное общество «Коммунистическая-35»',
    url: BASE_URL,
    telephone: '+73833223450',
    faxNumber: '+73832177224',
    email: 'kommunist35@mail.ru',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Коммунистическая, 35',
      addressLocality: 'Новосибирск',
      postalCode: '630007',
      addressCountry: 'RU',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  }
}

export function ContactsPage() {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Контакты', url: `${BASE_URL}/contacts` },
  ])

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessSchema()) }}
      />

      <ContactsHero />

      <div className={styles.panel}>
        <div className={styles.panelInner}>
          {/* ─── Контактная информация ─────────────── */}
          <section id="contacts-content" className={styles.section} aria-labelledby="contacts-h2">
            <span className={styles.sectionLabel} aria-hidden="true">
              Прямые контакты
            </span>
            <h2 id="contacts-h2" className={styles.sectionTitle}>
              Свяжитесь с нами
            </h2>

            {/* Четыре карточки */}
            <div className={styles.contactsGrid}>
              <a href="tel:+73832234350" className={styles.contactCard}>
                <span className={styles.contactIconWrap} aria-hidden="true">
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
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactLabel}>Приёмная</p>
                  <span className={styles.contactValue}>+7&nbsp;(383)&nbsp;223-43-50</span>
                </div>
              </a>

              <a href="tel:+73832178007" className={styles.contactCard}>
                <span className={styles.contactIconWrap} aria-hidden="true">
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
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactLabel}>Отдел аренды</p>
                  <span className={styles.contactValue}>+7&nbsp;(383)&nbsp;217-80-07</span>
                </div>
              </a>

              <a href="mailto:kommunist35@mail.ru" className={styles.contactCard}>
                <span className={styles.contactIconWrap} aria-hidden="true">
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactLabel}>E-mail</p>
                  <span className={styles.contactValue}>kommunist35@mail.ru</span>
                </div>
              </a>

              <div className={styles.contactCard}>
                <span className={styles.contactIconWrap} aria-hidden="true">
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
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactLabel}>Адрес</p>
                  <span className={styles.contactValue}>
                    630007, г.&nbsp;Новосибирск,
                    <br />
                    ул.&nbsp;Коммунистическая,&nbsp;35
                  </span>
                </div>
              </div>
            </div>

            {/* Часы работы */}
            <div className={styles.hoursCard} role="note" aria-label="Режим работы">
              <span className={styles.hoursIcon} aria-hidden="true">
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <div className={styles.hoursBody}>
                <p className={styles.hoursTitle}>Режим работы</p>
                <div className={styles.hoursRow}>
                  <div className={styles.hoursItem}>
                    <span className={styles.hoursDay}>Пн — Пт</span>
                    <span className={styles.hoursTime}>9:00 — 18:00</span>
                  </div>
                  <span className={styles.hoursDivider} aria-hidden="true" />
                  <div className={styles.hoursItem}>
                    <span className={styles.hoursDay}>Сб — Вс</span>
                    <span className={`${styles.hoursTime} ${styles.hoursOff}`}>выходной</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* LeadForm — полная версия, на уровне panel (не внутри panelInner) */}
        <LeadForm />

        <Footer />
      </div>
    </div>
  )
}
