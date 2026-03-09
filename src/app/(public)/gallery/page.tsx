import type { Metadata } from 'next'
import { GalleryPage } from './_page/GalleryPage'
import type { GalleryImage } from '@/entities/gallery'

export const revalidate = 600

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export const metadata: Metadata = {
  title: 'Фотогалерея — Бизнес-центр Коммунистическая, 35',
  description:
    'Фотографии офисных помещений, переговорных залов, зон отдыха и инфраструктуры бизнес-центра на Коммунистической, 35.',
  openGraph: {
    title: 'Фотогалерея — БЦ Коммунистическая, 35',
    description: 'Интерьеры и пространства бизнес-центра: офисы, переговорные, коворкинг.',
    url: `${BASE_URL}/gallery`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-gallery.jpg`,
        width: 1200,
        height: 630,
        alt: 'Фотогалерея бизнес-центра Коммунистическая, 35',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Фотогалерея — БЦ Коммунистическая, 35',
    description: 'Интерьеры и пространства бизнес-центра: офисы, переговорные, коворкинг.',
    images: [`${BASE_URL}/og-gallery.jpg`],
  },
  alternates: {
    canonical: '/gallery',
  },
}

// TODO Sprint 2: заменить на fetch('/api/gallery') с revalidate: 600
const mockImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://picsum.photos/seed/bc-g1/1200/800',
    caption: 'Переговорный зал',
    order: 0,
  },
  { id: '2', url: 'https://picsum.photos/seed/bc-g2/800/900', caption: null, order: 1 },
  { id: '3', url: 'https://picsum.photos/seed/bc-g3/900/700', caption: 'Зона рецепции', order: 2 },
  { id: '4', url: 'https://picsum.photos/seed/bc-g4/700/900', caption: null, order: 3 },
  { id: '5', url: 'https://picsum.photos/seed/bc-g5/1200/750', caption: 'Коворкинг', order: 4 },
  {
    id: '6',
    url: 'https://picsum.photos/seed/bc-g6/1100/800',
    caption: 'Open-space офис',
    order: 5,
  },
  { id: '7', url: 'https://picsum.photos/seed/bc-g7/850/700', caption: null, order: 6 },
  { id: '8', url: 'https://picsum.photos/seed/bc-g8/800/850', caption: 'Конференц-зал', order: 7 },
  { id: '9', url: 'https://picsum.photos/seed/bc-g9/1000/700', caption: null, order: 8 },
  { id: '10', url: 'https://picsum.photos/seed/bc-g10/1200/800', caption: 'Зона отдыха', order: 9 },
  { id: '11', url: 'https://picsum.photos/seed/bc-g11/900/720', caption: 'Кухня', order: 10 },
  { id: '12', url: 'https://picsum.photos/seed/bc-g12/800/600', caption: null, order: 11 },
]

export default function Gallery() {
  return <GalleryPage images={mockImages} />
}
