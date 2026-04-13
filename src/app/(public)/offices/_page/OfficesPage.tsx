import { OfficesHero } from './OfficesHero'
import { OfficesContent } from './OfficesContent'
import { OfficesCtaButton } from './OfficesCtaButton'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import type { Room } from '@/entities/room'
import styles from './OfficesPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

interface Props {
  allRooms: Room[]
  initialStatus: string
  initialSort: string
  initialType: string
}

export function OfficesPage({ allRooms, initialStatus, initialSort, initialType }: Props) {
  const freeCount = allRooms.filter((r) => r.status === 'FREE').length

  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Аренда офисов', url: `${BASE_URL}/offices` },
  ])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Офисы в аренду — БЦ Коммунистическая, 35',
    numberOfItems: allRooms.length,
    itemListElement: allRooms.map((room, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/offices/${room.slug}`,
      name: room.title,
    })),
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <OfficesHero total={allRooms.length} freeCount={freeCount} />

      <div className={styles.panel}>
        <div id="offices-content" className={styles.panelInner}>
          <span className={styles.sectionLabel} aria-hidden="true">
            Все помещения
          </span>

          <OfficesContent
            allRooms={allRooms}
            initialStatus={initialStatus}
            initialSort={initialSort}
            initialType={initialType}
          />

          {/* CTA снизу */}
          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Не нашли подходящий вариант?</h2>
              <p className={styles.ctaText}>
                Оставьте заявку — подберём офис под ваши требования и бюджет
              </p>
            </div>
            <OfficesCtaButton />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
