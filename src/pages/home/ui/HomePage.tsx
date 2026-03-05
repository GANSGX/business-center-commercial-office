import { HeroSlider } from '@/widgets/hero-slider'
import { OffersPreview } from '@/widgets/offers-preview'
import { Advantages } from '@/widgets/advantages'

// TODO Sprint 1: добавить секции по мере готовности виджетов:
// Tenants → LeadForm → Map

export function HomePage() {
  return (
    <>
      <HeroSlider />
      <OffersPreview />
      <Advantages />
    </>
  )
}
