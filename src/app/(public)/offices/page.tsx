import type { Metadata } from 'next'
import type { RoomStatus, RoomSortOption } from '@/entities/room'
import { OfficesPage } from './_page/OfficesPage'
import { MOCK_ROOM } from '@/shared/lib/mock-data'

export const revalidate = 60

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export const metadata: Metadata = {
  title: 'Аренда офисов — Бизнес-центр Коммунистическая, 35',
  description:
    'Офисные помещения от 18 до 72\u00a0м² в бизнес-центре на Коммунистической, 35 в Новосибирске. Долгосрочная и краткосрочная аренда. Оптоволокно, охрана, парковка.',
  openGraph: {
    title: 'Аренда офисов — БЦ Коммунистическая, 35',
    description:
      'Офисы от 18 до 72\u00a0м² в центре Новосибирска. Свободные помещения с фото и ценами.',
    url: `${BASE_URL}/offices`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-offices.jpg`,
        width: 1200,
        height: 630,
        alt: 'Аренда офисов в бизнес-центре Коммунистическая, 35',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Аренда офисов — БЦ Коммунистическая, 35',
    description: 'Офисы от 18 до 72\u00a0м² в центре Новосибирска.',
  },
  alternates: {
    canonical: '/offices',
  },
}

interface PageProps {
  searchParams: Promise<{ status?: string; sort?: string; type?: string }>
}

const VALID_STATUSES: RoomStatus[] = ['FREE', 'RESERVED', 'RENTED']
const VALID_SORTS: RoomSortOption[] = ['price_asc', 'price_desc', 'area_asc', 'area_desc', '']
const VALID_TYPES = ['Офис', 'Склад']

export default async function OfficesPageRoute({ searchParams }: PageProps) {
  const { status: rawStatus, sort: rawSort, type: rawType } = await searchParams

  const activeStatus = VALID_STATUSES.includes(rawStatus as RoomStatus)
    ? (rawStatus as RoomStatus)
    : ''
  const activeSort = VALID_SORTS.includes(rawSort as RoomSortOption)
    ? (rawSort as RoomSortOption)
    : ''
  const activeType = VALID_TYPES.includes(rawType ?? '') ? (rawType as string) : ''

  const allRooms = [MOCK_ROOM]

  return (
    <OfficesPage
      allRooms={allRooms}
      initialStatus={activeStatus}
      initialSort={activeSort}
      initialType={activeType}
    />
  )
}
