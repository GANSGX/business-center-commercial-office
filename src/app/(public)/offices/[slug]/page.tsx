import type { Metadata } from 'next'
import { OfficePage } from '@/views/office-detail'
import { Footer } from '@/widgets/footer'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import { sanitizeRichText } from '@/shared/lib/sanitize'
import { MOCK_ROOM } from '@/shared/lib/mock-data'

export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const room = MOCK_ROOM
  const plainDesc = room.description?.replace(/<[^>]*>/g, '').slice(0, 155) ?? ''
  return {
    title: `${room.title} — аренда ${room.area}\u00a0м², этаж ${room.floor} | Коммунистическая-35`,
    description:
      plainDesc ||
      `Аренда офиса ${room.area}\u00a0м² на ${room.floor} этаже в бизнес-центре Коммунистическая-35. ${room.priceMonth.toLocaleString('ru-RU')}\u00a0₽/мес.`,
    openGraph: {
      title: `${room.title} — ${room.area}\u00a0м², этаж ${room.floor}`,
      description: plainDesc,
      images: room.photos[0] ? [{ url: room.photos[0].url, alt: room.title }] : [],
    },
    alternates: { canonical: `/offices/${room.slug}` },
  }
}

export default async function OfficeSlugPage({ params }: PageProps) {
  // Любой slug → показываем единственный офис
  void params

  const room = MOCK_ROOM

  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: '/' },
    { name: 'Аренда офисов', url: '/offices' },
    { name: room.title, url: `/offices/${room.slug}` },
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
      availability: 'https://schema.org/InStock',
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
      <div style={{ background: '#0a0a0a' }}>
        <OfficePage
          room={{
            ...room,
            description: room.description ? sanitizeRichText(room.description) : null,
          }}
        />
        <Footer />
      </div>
    </>
  )
}
