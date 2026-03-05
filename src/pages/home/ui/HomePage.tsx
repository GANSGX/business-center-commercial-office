import { HeroSlider } from '@/widgets/hero-slider'
import { OffersPreview } from '@/widgets/offers-preview'
import { Advantages } from '@/widgets/advantages'
import { Tenants } from '@/widgets/tenants'
import { LeadForm } from '@/widgets/lead-form'
import styles from './HomePage.module.css'

// TODO Sprint 1: добавить секции по мере готовности виджетов:
// Map

export function HomePage() {
  return (
    <>
      <HeroSlider />
      {/* Единый тёмный контейнер — один background, нет границы между секциями */}
      <div className={styles.darkPanel}>
        <OffersPreview />
        <Advantages />
        <Tenants />
        <LeadForm />
      </div>
    </>
  )
}
