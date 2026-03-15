import { Header } from '@/widgets/header'
import { CookieBannerLazy } from '@/widgets/cookie-banner'
import { LeadModalLazy } from '@/widgets/lead-form'
import { AnalyticsTracker } from '@/widgets/analytics-tracker'
import { ScrollToTop, Preloader } from '@/shared/ui'
import styles from './layout.module.css'

// TODO Sprint 1: заменить на fetch('/api/services') с ISR revalidate
const mockServices = [
  { title: 'Парковка', slug: 'parking' },
  { title: 'Реклама внутри здания', slug: 'advertising' },
  { title: 'Клининг', slug: 'cleaning' },
  { title: 'Охрана', slug: 'security' },
  { title: 'Почтовая ячейка', slug: 'mailbox' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
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
