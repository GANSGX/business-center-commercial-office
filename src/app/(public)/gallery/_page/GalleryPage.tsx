import { GalleryHero } from './GalleryHero'
import { GalleryGrid } from '@/widgets/gallery-grid'
import { Footer } from '@/widgets/footer'
import type { GalleryImage } from '@/entities/gallery'
import { buildBreadcrumbList } from '@/shared/lib/jsonld'
import Link from 'next/link'
import styles from './GalleryPage.module.css'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

interface Props {
  images: GalleryImage[]
}

function buildImageGallery(images: GalleryImage[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Фотогалерея бизнес-центра Коммунистическая, 35',
    description: 'Интерьеры и пространства бизнес-центра: офисы, переговорные, коворкинг.',
    url: `${BASE_URL}/gallery`,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: img.url,
      name: img.caption ?? 'Фото бизнес-центра',
      description: img.caption ?? 'Фото бизнес-центра Коммунистическая, 35',
    })),
  }
}

export function GalleryPage({ images }: Props) {
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: 'Главная', url: `${BASE_URL}/` },
    { name: 'Фотогалерея', url: `${BASE_URL}/gallery` },
  ])
  const galleryJsonLd = buildImageGallery(images)

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      {/* ── Hero c JS-блюром (client component) ── */}
      <GalleryHero imageCount={images.length} />

      {/* ── Основной контент ── */}
      <div id="gallery-panel" className={styles.panel}>
        <div className={styles.panelInner}>
          <section id="gallery-section-label" aria-labelledby="gallery-h2">
            <span className={styles.sectionLabel} aria-hidden="true">
              Фото и видео
            </span>
            <h2 id="gallery-h2" className={styles.srOnly}>
              Фотогалерея бизнес-центра
            </h2>
            <GalleryGrid images={images} />
          </section>

          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Хотите посмотреть вживую?</h2>
              <p className={styles.ctaText}>
                Организуем бесплатный осмотр любого офиса в удобное для вас время
              </p>
            </div>
            <Link href="/contacts" className={styles.ctaBtn}>
              Записаться на просмотр
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
