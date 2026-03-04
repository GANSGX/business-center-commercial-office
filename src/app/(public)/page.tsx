import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'

export const metadata: Metadata = {
  title: 'Аренда офисов в Новосибирске — Деловой центр «На Октябрьской»',
  description:
    'Современные офисные помещения в центре Новосибирска. Гибкие условия аренды, развитая инфраструктура, 7 минут до метро «Площадь Ленина». Смотрите свободные офисы онлайн.',
  openGraph: {
    title: 'Деловой центр «На Октябрьской» — аренда офисов в Новосибирске',
    description:
      'Современные офисы в центре Новосибирска — гибкие условия аренды, развитая инфраструктура, выгодное расположение.',
    type: 'website',
    locale: 'ru_RU',
  },
  // TODO Sprint 1 S1-D2-07: добавить JSON-LD Organization + LocalBusiness
}

// ISR — обновление каждые 5 минут
export const revalidate = 300

export default function Page() {
  return <HomePage />
}
