import { HeroSlider } from '@/widgets/hero-slider'
import { OffersPreview } from '@/widgets/offers-preview'

// TODO Sprint 1: добавить секции по мере готовности виджетов:
// Advantages → Tenants → LeadForm → Map

export function HomePage() {
  return (
    <>
      <HeroSlider />
      <OffersPreview />
    </>
  )
}
