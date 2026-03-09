import { AboutHero } from './AboutHero'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import styles from './AboutPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'АО «Коммунистическая-35»',
    legalName: 'Акционерное общество «Коммунистическая-35»',
    url: BASE_URL,
    telephone: '+73833223450',
    faxNumber: '+73832177224',
    email: 'kommunist35@mail.ru',
    taxID: '5406247047',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Коммунистическая, 35',
      addressLocality: 'Новосибирск',
      postalCode: '630007',
      addressCountry: 'RU',
    },
  }
}

export function AboutPage() {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'О компании', url: `${BASE_URL}/about` },
  ])
  const organizationJsonLd = buildOrganizationSchema()

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* ── Hero c JS-блюром (client component) ── */}
      <AboutHero />

      {/* ── Основной контент ── */}
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          {/* ─── О компании ───────────────────────── */}
          <section id="about-content" className={styles.section}>
            <span id="about-section-label" className={styles.sectionLabel} aria-hidden="true">
              О бизнес-центре
            </span>
            <h2 className={styles.sectionTitle}>Кто мы</h2>

            <p className={styles.aboutLead}>
              Акционерное общество «Коммунистическая-35» — управляющая компания одноимённого
              бизнес-центра в&nbsp;историческом центре Новосибирска. Предоставляем в&nbsp;аренду
              офисные помещения площадью от&nbsp;15 до&nbsp;72&nbsp;м² для малого и&nbsp;среднего
              бизнеса.
            </p>
            <p className={`${styles.aboutText} ${styles.aboutTextSecondary}`}>
              В&nbsp;здании созданы все условия для комфортной работы: профессиональная охрана,
              ежедневная уборка, скоростной интернет и&nbsp;круглосуточный доступ. Удобное
              расположение обеспечивает отличную транспортную доступность для сотрудников
              и&nbsp;клиентов.
            </p>

            <div className={styles.statsRow} role="list" aria-label="Ключевые показатели">
              <div className={styles.statItem} role="listitem">
                <span className={styles.statNum}>20+</span>
                <span className={styles.statLabel}>лет на рынке</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.statItem} role="listitem">
                <span className={styles.statNum}>50+</span>
                <span className={styles.statLabel}>офисных помещений</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.statItem} role="listitem">
                <span className={styles.statNum}>Центр</span>
                <span className={styles.statLabel}>Новосибирска</span>
              </div>
            </div>
          </section>

          {/* ─── Реквизиты ────────────────────────── */}
          <section className={styles.section} id="requisites">
            <span className={styles.sectionLabel} aria-hidden="true">
              Юридическая информация
            </span>
            <h2 className={styles.sectionTitle}>Реквизиты организации</h2>

            <div className={styles.reqGrid}>
              {/* Общие сведения */}
              <div className={styles.reqCard}>
                <div className={styles.reqCardHeader}>
                  <span className={styles.reqCardIcon} aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 00-4 0v2" />
                      <line x1="12" y1="12" x2="12" y2="16" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                    </svg>
                  </span>
                  <h3 className={styles.reqCardTitle}>Общие сведения</h3>
                </div>
                <dl className={styles.reqList}>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Полное наименование</dt>
                    <dd className={styles.reqValue}>Акционерное общество «Коммунистическая-35»</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Сокращённое наименование</dt>
                    <dd className={styles.reqValue}>АО «Коммунистическая-35»</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Юридический адрес</dt>
                    <dd className={styles.reqValue}>
                      630007, г.&nbsp;Новосибирск, ул.&nbsp;Коммунистическая,&nbsp;35
                    </dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>ИНН</dt>
                    <dd className={styles.reqValue}>5406247047</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>КПП</dt>
                    <dd className={styles.reqValue}>540601001</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>ОГРН</dt>
                    <dd className={styles.reqValue}>1035402474293</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Руководитель</dt>
                    <dd className={styles.reqValue}>Усенко Виталий Владимирович (Директор)</dd>
                  </div>
                </dl>
              </div>

              {/* Банковские реквизиты */}
              <div className={styles.reqCard}>
                <div className={styles.reqCardHeader}>
                  <span className={styles.reqCardIcon} aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </span>
                  <h3 className={styles.reqCardTitle}>Банковские реквизиты</h3>
                </div>
                <dl className={styles.reqList}>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Расчётный счёт</dt>
                    <dd className={styles.reqValue}>40702810123220000356</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Банк</dt>
                    <dd className={styles.reqValue}>Филиал «НОВОСИБИРСКИЙ» АО «АЛЬФА-БАНК»</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Город</dt>
                    <dd className={styles.reqValue}>г.&nbsp;Новосибирск</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>БИК</dt>
                    <dd className={styles.reqValue}>045004774</dd>
                  </div>
                  <div className={styles.reqRow}>
                    <dt className={styles.reqLabel}>Корреспондентский счёт</dt>
                    <dd className={styles.reqValue}>30101810600000000774</dd>
                  </div>
                </dl>
                <p className={styles.reqNote}>
                  Сведения внесены в&nbsp;Единый государственный реестр юридических лиц (ЕГРЮЛ).
                  Организация является налогоплательщиком на&nbsp;территории Российской Федерации
                  в&nbsp;соответствии с&nbsp;НК&nbsp;РФ.
                </p>
              </div>
            </div>
          </section>

          {/* ─── Контакты ─────────────────────────── */}
          <section className={styles.section} id="contacts">
            <span className={styles.sectionLabel} aria-hidden="true">
              Связаться с нами
            </span>
            <h2 className={styles.sectionTitle}>Контактная информация</h2>

            <div className={styles.contactGrid}>
              <a href="tel:+73833223450" className={styles.contactCard}>
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
                  <p className={styles.contactLabel}>Телефон</p>
                  <span className={styles.contactValue}>+7&nbsp;(383)&nbsp;223-43-50</span>
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
                    <polyline points="22 2 11 13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactLabel}>Факс</p>
                  <span className={styles.contactValue}>+7&nbsp;(383)&nbsp;217-72-24</span>
                </div>
              </div>

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
                    630007, г.&nbsp;Новосибирск, ул.&nbsp;Коммунистическая,&nbsp;35
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  )
}
