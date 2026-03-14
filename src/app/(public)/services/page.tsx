import type { Metadata } from 'next'
import { UnderConstruction } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Дополнительные услуги — БЦ Коммунистическая, 35',
  robots: { index: false },
}

// TODO Sprint 2: Список дополнительных услуг
export default function ServicesPage() {
  return (
    <UnderConstruction
      title="Услуги в разработке"
      subtitle={
        'Раздел дополнительных услуг скоро появится.\nЗдесь будут аренда переговорных, парковка и многое другое.'
      }
      backHref="/"
      backLabel="На главную"
    />
  )
}
