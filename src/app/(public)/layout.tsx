import { Header } from '@/widgets/header'
import { CookieBannerLazy } from '@/widgets/cookie-banner'
import { LeadModalLazy } from '@/widgets/lead-form'
import { TenantPlacementModal } from '@/features/tenant-placement'
import { AnalyticsTracker, MetrikaScript } from '@/widgets/analytics-tracker'
import { ScrollToTop, Preloader } from '@/shared/ui'
import { getSiteSettings } from '@/shared/lib/getSiteSettings'
import styles from './layout.module.css'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const metrikaId = settings['metrikaId'] ?? ''

  return (
    <div className={styles.page}>
      <MetrikaScript counterId={metrikaId} />
      <Preloader />
      <ScrollToTop />
      <AnalyticsTracker />
      <Header />
      <main>{children}</main>
      <LeadModalLazy />
      <TenantPlacementModal />
      <CookieBannerLazy />
    </div>
  )
}
