import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'

export const metadata: Metadata = {
  title: 'Аренда офисов в Новосибирске — Бизнес-центр «Коммунистическая-35»',
  description:
    'Аренда офисов от 8 до 150 м² в центре Новосибирска. Бизнес-центр класса Б+, 5–10 минут до метро «Площадь Ленина», бесплатная парковка, охрана 24/7. Смотрите свободные офисы онлайн.',
  openGraph: {
    title: 'Бизнес-центр «Коммунистическая-35» — аренда офисов в Новосибирске',
    description:
      'Офисы от 8 до 150 м² в центре Новосибирска. Класс Б+, 5–10 мин до метро, парковка, охрана 24/7, гибкие условия аренды.',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/images/hero-1.png',
        width: 1200,
        height: 630,
        alt: 'Бизнес-центр «Коммунистическая-35» — аренда офисов в Новосибирске',
      },
    ],
  },
  // TODO Sprint 1 S1-D2-07: добавить JSON-LD Organization + LocalBusiness
}

// ISR — обновление каждые 5 минут
export const revalidate = 300

export default function Page() {
  return <HomePage />
}
