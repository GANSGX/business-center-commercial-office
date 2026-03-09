'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/entities/gallery'
import styles from './GalleryGrid.module.css'

interface Props {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null))
  }, [images.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, prev, next])

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p>Фотографии появятся в ближайшее время</p>
      </div>
    )
  }

  return (
    <>
      <ul className={styles.grid} aria-label="Фотогалерея бизнес-центра">
        {images.map((img, i) => (
          <li key={img.id} className={styles.item} style={{ '--i': i } as React.CSSProperties}>
            <button
              type="button"
              className={styles.itemBtn}
              onClick={() => setLightboxIndex(i)}
              aria-label={img.caption ?? `Открыть фото ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? `Фото галереи ${i + 1}`}
                fill
                className={styles.itemImg}
                loading={i < 6 ? 'eager' : 'lazy'}
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 420px"
              />
              <div className={styles.itemOverlay} aria-hidden="true">
                <span className={styles.zoomIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
                {img.caption && <span className={styles.itemCaption}>{img.caption}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Лайтбокс ── */}
      {lightboxIndex !== null && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
        >
          {/* Закрыть */}
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Закрыть"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Стрелки */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={prev}
                aria-label="Предыдущее фото"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={next}
                aria-label="Следующее фото"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Фото */}
          <figure className={styles.lightboxFigure}>
            <div className={styles.lightboxImg}>
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].caption ?? `Фото ${lightboxIndex + 1}`}
                fill
                className={styles.fullImg}
                sizes="100vw"
                priority
              />
            </div>
            {images[lightboxIndex].caption && (
              <figcaption className={styles.lightboxCaption}>
                {images[lightboxIndex].caption}
              </figcaption>
            )}
          </figure>

          {/* Превью-полоска */}
          {images.length > 1 && (
            <div className={styles.thumbsStrip} role="list" aria-label="Все фото">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  role="listitem"
                  className={`${styles.thumb} ${i === lightboxIndex ? styles.thumbActive : ''}`}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Фото ${i + 1}`}
                  aria-pressed={i === lightboxIndex}
                >
                  <Image
                    src={img.url}
                    alt={`фото ${i + 1}`}
                    fill
                    className={styles.thumbImg}
                    sizes="72px"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Счётчик */}
          <div className={styles.counter} aria-live="polite" aria-atomic="true">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
