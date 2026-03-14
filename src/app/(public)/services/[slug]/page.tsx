import type { Metadata } from 'next'
import { UnderConstruction } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Услуга — БЦ Коммунистическая, 35',
  robots: { index: false },
}

// TODO Sprint 2: Карточка услуги — richtext, ServiceOptions, LeadForm
export default function ServiceSlugPage() {
  return (
    <UnderConstruction
      title="Страница в разработке"
      subtitle={
        'Информация об этой услуге скоро появится.\nСвяжитесь с нами напрямую — мы ответим на все вопросы.'
      }
      backHref="/services"
      backLabel="Все услуги"
    />
  )
}
