'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { RoomPhoto } from '@/entities/room'
import styles from './PhotoGallery.module.css'

interface Props {
  photos: RoomPhoto[]
  alt: string
}

export function PhotoGallery({ photos, alt }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [photos.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null))
  }, [photos.length])

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
  }, [lightboxIndex, prev, next])

  if (photos.length === 0) return null

  const mainPhoto = photos[0]

  return (
    <>
      {/* Main image */}
      <button
        type="button"
        className={styles.mainBtn}
        onClick={() => openLightbox(0)}
        aria-label="Открыть галерею фотографий"
      >
        <Image
          src={mainPhoto.url}
          alt={alt}
          fill
          className={styles.mainImg}
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        {photos.length > 1 && (
          <span className={styles.photoCount} aria-hidden="true">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {photos.length}
          </span>
        )}
      </button>

      {/* Thumbnails strip */}
      {photos.length > 1 && (
        <div className={styles.thumbs} role="list" aria-label="Фотографии офиса">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              role="listitem"
              className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ''}`}
              onClick={() => openLightbox(i)}
              aria-label={`Фото ${i + 1}`}
            >
              <Image
                src={photo.url}
                alt={`${alt} — фото ${i + 1}`}
                fill
                className={styles.thumbImg}
                sizes="96px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
        >
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

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={prev}
                aria-label="Предыдущее фото"
              >
                <svg
                  width="20"
                  height="20"
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
                  width="20"
                  height="20"
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

          <div className={styles.lightboxImg}>
            <Image
              src={photos[lightboxIndex].url}
              alt={`${alt} — фото ${lightboxIndex + 1}`}
              fill
              className={styles.fullImg}
              sizes="100vw"
              priority
            />
          </div>

          {photos.length > 1 && (
            <div className={styles.lightboxDots} aria-hidden="true">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === lightboxIndex ? styles.dotActive : ''}`}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
          )}

          <div className={styles.lightboxCounter} aria-live="polite">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
