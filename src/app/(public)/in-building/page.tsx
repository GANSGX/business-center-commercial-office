import type { Metadata } from 'next'
import { InBuildingPage } from './_page/InBuildingPage'
import { MOCK_BUILDING_ORGS } from '@/shared/lib/mock-data'

export const revalidate = false

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export const metadata: Metadata = {
  title: 'В здании — Бизнес-центр Коммунистическая, 35',
  description:
    'Список организаций, магазинов и сервисов, работающих в бизнес-центре на Коммунистической, 35 в Новосибирске.',
  openGraph: {
    title: 'В здании — БЦ Коммунистическая, 35',
    description: 'Компании, кафе, услуги и сервисы внутри бизнес-центра.',
    url: `${BASE_URL}/in-building`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/hero-1.png`,
        width: 1200,
        height: 630,
        alt: 'В здании бизнес-центра Коммунистическая, 35',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'В здании — БЦ Коммунистическая, 35',
    description: 'Компании, кафе, услуги и сервисы внутри бизнес-центра.',
    images: [`${BASE_URL}/images/hero-1.png`],
  },
  alternates: {
    canonical: '/in-building',
  },
}

export default function InBuilding() {
  return <InBuildingPage orgs={MOCK_BUILDING_ORGS} />
}
