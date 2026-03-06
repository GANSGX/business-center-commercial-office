import { HeroSlider } from '@/widgets/hero-slider'
import { OffersPreview } from '@/widgets/offers-preview'
import { Advantages } from '@/widgets/advantages'
import { Tenants } from '@/widgets/tenants'
import { LeadFormLazy } from '@/widgets/lead-form'
import { MapSectionLazy } from '@/widgets/map'
import { Footer } from '@/widgets/footer'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <>
      <HeroSlider />
      {/* Единый тёмный контейнер — один background, нет границы между секциями */}
      <div className={styles.darkPanel}>
        <OffersPreview />
        <Advantages />
        <Tenants />
        <LeadFormLazy />
        <MapSectionLazy />
        <Footer />
      </div>
    </>
  )
}
