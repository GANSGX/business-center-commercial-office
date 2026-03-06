import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

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
  alternates: {
    canonical: '/',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Бизнес-центр «Коммунистическая-35»',
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Коммунистическая, 35',
    addressLocality: 'Новосибирск',
    addressRegion: 'Новосибирская область',
    addressCountry: 'RU',
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Бизнес-центр «Коммунистическая-35»',
  description:
    'Аренда офисов от 8 до 150 м² в центре Новосибирска. Класс Б+, 5–10 минут до метро, парковка, охрана 24/7.',
  url: BASE_URL,
  image: `${BASE_URL}/images/hero-1.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Коммунистическая, 35',
    addressLocality: 'Новосибирск',
    addressRegion: 'Новосибирская область',
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 54.9736,
    longitude: 82.9282,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  priceRange: '₽₽',
}

// ISR — обновление каждые 5 минут
export const revalidate = 300

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomePage />
    </>
  )
}
