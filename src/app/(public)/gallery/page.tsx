import type { Metadata } from 'next'
import { GalleryPage } from './_page/GalleryPage'

export const revalidate = false

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

export default function Gallery() {
  return <GalleryPage images={[]} />
}
