import { InBuildingHero } from './InBuildingHero'
import { InBuildingCtaButton } from './InBuildingCtaButton'
import { InBuildingLiveList } from './InBuildingLiveList'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import styles from './InBuildingPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export type OrgCategory = 'food' | 'service' | 'retail' | 'bank' | 'other'

export interface BuildingOrgItem {
  id: string
  name: string
  category: string
  description: string | null
  website: string | null
  floor: number
  color: string
  order: number
  active: boolean
}

interface Props {
  orgs: BuildingOrgItem[]
}

export function InBuildingPage({ orgs }: Props) {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'В здании', url: `${BASE_URL}/in-building` },
  ])

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InBuildingHero orgCount={orgs.length} />

      <div id="inbuilding-panel" className={styles.panel}>
        <div className={styles.panelInner}>
          <InBuildingLiveList initialOrgs={orgs} />

          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Хотите арендовать офис здесь?</h2>
              <p className={styles.ctaText}>
                Офисные помещения от 10 м² — подберём вариант под вашу задачу
              </p>
            </div>
            <InBuildingCtaButton />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
