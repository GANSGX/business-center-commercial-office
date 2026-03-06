import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getRoomBySlug } from '@/entities/room'
import { OfficePage } from '@/pages/office-detail'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import { sanitizeRichText } from '@/shared/lib/sanitize'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoomBySlug(slug)
  if (!room) return {}

  const plainDesc = room.description?.replace(/<[^>]*>/g, '').slice(0, 155) ?? ''
  const title = `${room.title} — аренда ${room.area}\u00a0м², этаж ${room.floor} | Коммунистическая-35`

  return {
    title,
    description:
      plainDesc ||
      `Аренда офиса ${room.area}\u00a0м² на ${room.floor} этаже в бизнес-центре Коммунистическая-35. ${room.priceMonth.toLocaleString('ru-RU')}\u00a0₽/мес.`,
    openGraph: {
      title: `${room.title} — ${room.area}\u00a0м², этаж ${room.floor}`,
      description: plainDesc,
      images: room.photos[0] ? [{ url: room.photos[0].url, alt: room.title }] : [],
    },
    alternates: {
      canonical: `/offices/${slug}`,
    },
  }
}

export default async function OfficeSlugPage({ params }: PageProps) {
  const { slug } = await params
  const room = await getRoomBySlug(slug)

  if (!room) notFound()

  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: '/' },
    { name: 'Аренда офисов', url: '/offices' },
    { name: room.title, url: `/offices/${slug}` },
  ])

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: room.title,
    description: room.description?.replace(/<[^>]*>/g, '') ?? '',
    image: room.photos[0]?.url,
    offers: {
      '@type': 'Offer',
      price: room.priceMonth,
      priceCurrency: 'RUB',
      availability:
        room.status === 'FREE'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/LimitedAvailability',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <OfficePage
        room={{
          ...room,
          description: room.description ? sanitizeRichText(room.description) : null,
        }}
      />
    </>
  )
}
