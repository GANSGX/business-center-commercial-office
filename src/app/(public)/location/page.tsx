import type { Metadata } from 'next'
import { LocationPage } from './_page/LocationPage'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Расположение — БЦ «Коммунистическая, 35»',
  description:
    'Как добраться до бизнес-центра «Коммунистическая, 35» в Новосибирске. Адрес: ул. Коммунистическая, 35. 5 минут пешком от метро «Площадь Ленина». Удобная парковка во дворе.',
  alternates: {
    canonical: '/location',
  },
  openGraph: {
    title: 'Расположение — БЦ «Коммунистическая, 35»',
    description:
      'Бизнес-центр в самом центре Новосибирска. 5 минут от метро, удобный въезд, парковка во дворе.',
    url: '/location',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/images/hero-1.png',
        width: 1200,
        height: 630,
        alt: 'Расположение бизнес-центра Коммунистическая, 35 в Новосибирске',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Расположение — БЦ «Коммунистическая, 35»',
    description: 'Как добраться до бизнес-центра в центре Новосибирска.',
  },
}

export default function Page() {
  return <LocationPage />
}
