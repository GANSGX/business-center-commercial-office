import { ContactsHero } from './ContactsHero'
import { LeadForm } from '@/widgets/lead-form'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import { getSiteSettings, toTelHref } from '@/shared/lib/getSiteSettings'
import styles from './ContactsPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export async function ContactsPage() {
  const s = await getSiteSettings()

  const phone1 = s['phone1']
  const phone2 = s['phone2']
  const email = s['email']
  const address = s['address']
  const workHours = s['workHours']
  const workHoursAdmin = s['workHoursAdmin']

  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Контакты', url: `${BASE_URL}/contacts` },
  ])

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'АО «Коммунистическая-35»',
    legalName: 'Акционерное общество «Коммунистическая-35»',
    url: BASE_URL,
    telephone: toTelHref(phone1).replace('tel:', ''),
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Коммунистическая, 35',
      addressLocality: 'Новосибирск',
      postalCode: '630007',
      addressCountry: 'RU',
    },
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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

            <div className={styles.contactsGrid}>
              <a href={toTelHref(phone1)} className={styles.contactCard}>
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
                  <span className={styles.contactValue}>{phone1}</span>
                </div>
              </a>

              <a href={toTelHref(phone2)} className={styles.contactCard}>
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
                  <span className={styles.contactValue}>{phone2}</span>
                </div>
              </a>

              <a href={`mailto:${email}`} className={styles.contactCard}>
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
                  <span className={styles.contactValue}>{email}</span>
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
                  <span className={styles.contactValue}>{address}</span>
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
                {workHours && (
                  <p className={styles.hoursTime}>
                    <span className={styles.hoursLabel}>БЦ:&nbsp;</span>
                    {workHours}
                  </p>
                )}
                {workHoursAdmin && (
                  <p className={styles.hoursTime}>
                    <span className={styles.hoursLabel}>Администрация:&nbsp;</span>
                    {workHoursAdmin}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <LeadForm />
        <Footer />
      </div>
    </div>
  )
}
