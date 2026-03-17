import { Header } from '@/widgets/header'
import { CookieBannerLazy } from '@/widgets/cookie-banner'
import { LeadModalLazy } from '@/widgets/lead-form'
import { AnalyticsTracker, MetrikaScript } from '@/widgets/analytics-tracker'
import { ScrollToTop, Preloader } from '@/shared/ui'
import { getSiteSettings } from '@/shared/lib/getSiteSettings'
import styles from './layout.module.css'

// TODO Sprint 1: заменить на fetch('/api/services') с ISR revalidate
const mockServices = [
  { title: 'Парковка', slug: 'parking' },
  { title: 'Реклама внутри здания', slug: 'advertising' },
  { title: 'Клининг', slug: 'cleaning' },
  { title: 'Охрана', slug: 'security' },
  { title: 'Почтовая ячейка', slug: 'mailbox' },
]

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const metrikaId = settings['metrikaId'] ?? ''

  return (
    <div className={styles.page}>
      <MetrikaScript counterId={metrikaId} />
      <Preloader />
      <ScrollToTop />
      <AnalyticsTracker />
      <Header services={mockServices} />
      <main>{children}</main>
      <LeadModalLazy />
      <CookieBannerLazy />
    </div>
  )
}
