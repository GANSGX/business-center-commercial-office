import { GalleryHero } from './GalleryHero'
import { GalleryGrid } from '@/widgets/gallery-grid'
import { Footer } from '@/widgets/footer'
import type { GalleryImage } from '@/entities/gallery'
import Link from 'next/link'
import styles from './GalleryPage.module.css'

interface Props {
  images: GalleryImage[]
}

export function GalleryPage({ images }: Props) {
  return (
    <div className={styles.page}>
      {/* ── Hero c JS-блюром (client component) ── */}
      <GalleryHero imageCount={images.length} />

      {/* ── Основной контент ── */}
      <div id="gallery-panel" className={styles.panel}>
        <div className={styles.panelInner}>
          <div id="gallery-section-label" className={styles.sectionLabel} aria-hidden="true">
            Фото и видео
          </div>

          <div id="gallery-grid">
            <GalleryGrid images={images} />
          </div>

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
