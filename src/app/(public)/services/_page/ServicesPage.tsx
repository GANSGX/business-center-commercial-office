import { ServicesHero } from './ServicesHero'
import { ServicesCtaButton } from './ServicesCtaButton'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import styles from './ServicesPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

interface Service {
  id: string
  slug: string
  title: string
  description: string
  details: string[]
  color: 'amber' | 'blue' | 'green' | 'purple' | 'red' | 'teal'
  icon: React.ReactNode
}

const SERVICES = [
  {
    id: '1',
    slug: 'parking',
    title: 'Парковка',
    description:
      'Охраняемая парковка на территории бизнес-центра. Удобный въезд и выезд, видеонаблюдение 24/7.',
    details: ['Охраняемая территория', 'Видеонаблюдение 24/7', 'Доступно для арендаторов'],
    color: 'blue' as const,
  },
  {
    id: '2',
    slug: 'advertising',
    title: 'Реклама внутри здания',
    description:
      'Размещение рекламных материалов в холле, на досках объявлений и в лифтах бизнес-центра.',
    details: ['Стенды в холле', 'Доски объявлений', 'Реклама в лифтах'],
    color: 'amber' as const,
  },
  {
    id: '3',
    slug: 'cleaning',
    title: 'Клининг',
    description:
      'Профессиональная уборка офисных помещений. Ежедневная, еженедельная или разовая уборка.',
    details: ['Ежедневная уборка', 'Генеральная уборка', 'Профессиональный инвентарь'],
    color: 'green' as const,
  },
  {
    id: '4',
    slug: 'security',
    title: 'Охрана',
    description:
      'Профессиональная охрана бизнес-центра круглосуточно. Пропускная система и видеонаблюдение.',
    details: ['Охрана 24/7', 'Пропускная система', 'Видеонаблюдение'],
    color: 'red' as const,
  },
  {
    id: '5',
    slug: 'mailbox',
    title: 'Почтовая ячейка',
    description:
      'Персональная почтовая ячейка для получения корреспонденции по юридическому адресу.',
    details: ['Юридический адрес', 'Приём корреспонденции', 'Уведомления о посылках'],
    color: 'purple' as const,
  },
]

export function ServicesPage() {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Дополнительные услуги', url: `${BASE_URL}/services` },
  ])

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ServicesHero serviceCount={SERVICES.length} />

      <div id="services-panel" className={styles.panel}>
        <div className={styles.panelInner}>
          <section className={styles.section}>
            <span className={styles.sectionLabel} aria-hidden="true">
              Все услуги
            </span>

            <div className={styles.grid}>
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.card} ${styles[`color_${service.color}`]}`}
                >
                  <div className={styles.cardIconWrap} aria-hidden="true">
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
                      <polyline points="12 8 12 12 14 14" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDesc}>{service.description}</p>
                  <ul className={styles.cardDetails}>
                    {service.details.map((d) => (
                      <li key={d} className={styles.cardDetail}>
                        <span className={styles.cardDetailDot} aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Нужна дополнительная услуга?</h2>
              <p className={styles.ctaText}>
                Свяжитесь с нами — подберём оптимальный пакет услуг для вашего бизнеса
              </p>
            </div>
            <ServicesCtaButton />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
