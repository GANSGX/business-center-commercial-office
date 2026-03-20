'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { RoomPhoto } from '@/entities/room'
import styles from './PhotoGallery.module.css'

interface Props {
  photos: RoomPhoto[]
  alt: string
  overlaySlot?: React.ReactNode
}

export function PhotoGallery({ photos, alt, overlaySlot }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const lbTouchStartX = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const prevActive = useCallback(() => {
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  }, [photos.length])

  const nextActive = useCallback(() => {
    setActiveIndex((i) => (i + 1) % photos.length)
  }, [photos.length])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? nextActive() : prevActive()
    touchStartX.current = null
  }

  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [photos.length])

  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null))
  }, [photos.length])

  const onLbTouchStart = (e: React.TouchEvent) => {
    lbTouchStartX.current = e.touches[0].clientX
  }

  const onLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - lbTouchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? nextLightbox() : prevLightbox()
    lbTouchStartX.current = null
  }

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.documentElement.setAttribute('data-lightbox-open', '')
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.documentElement.removeAttribute('data-lightbox-open')
    }
  }, [lightboxIndex, prevLightbox, nextLightbox])

  if (photos.length === 0) return null

  const lightbox =
    lightboxIndex !== null &&
    mounted &&
    createPortal(
      <div
        className={styles.overlay}
        onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        onTouchStart={onLbTouchStart}
        onTouchEnd={onLbTouchEnd}
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
              onClick={prevLightbox}
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
              onClick={nextLightbox}
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

        <div className={styles.lightboxImg} onTouchStart={onLbTouchStart} onTouchEnd={onLbTouchEnd}>
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
          <div className={styles.lightboxThumbs} aria-label="Все фото">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                className={`${styles.lbThumb} ${i === lightboxIndex ? styles.lbThumbActive : ''}`}
                onClick={() => setLightboxIndex(i)}
                aria-label={`Фото ${i + 1}`}
              >
                <Image
                  src={photo.url}
                  alt={`фото ${i + 1}`}
                  fill
                  className={styles.lbThumbImg}
                  sizes="80px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        <div className={styles.lightboxCounter} aria-live="polite">
          {lightboxIndex + 1} / {photos.length}
        </div>
      </div>,
      document.body
    )

  return (
    <div className={styles.gallery}>
      {/* ── Главное фото ── */}
      <div className={styles.mainArea} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Блюр-подложка: та же фотка, cover + сильный blur — заполняет пустые края */}
        <Image
          src={photos[activeIndex].url}
          alt=""
          aria-hidden="true"
          fill
          className={styles.blurBg}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        <button
          type="button"
          className={styles.mainBtn}
          onClick={() => openLightbox(activeIndex)}
          aria-label="Открыть полноэкранный просмотр"
        >
          <Image
            src={photos[activeIndex].url}
            alt={`${alt} — фото ${activeIndex + 1}`}
            fill
            className={styles.mainImg}
            priority
            fetchPriority="high"
            sizes="(max-width: 1248px) 100vw, 1200px"
          />
          <span className={styles.zoomHint} aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Открыть
          </span>
        </button>

        {photos.length > 1 && (
          <span className={styles.photoCount} aria-hidden="true">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {activeIndex + 1} / {photos.length}
          </span>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.sideBtn} ${styles.sidePrev}`}
              onClick={(e) => {
                e.stopPropagation()
                prevActive()
              }}
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
              className={`${styles.sideBtn} ${styles.sideNext}`}
              onClick={(e) => {
                e.stopPropagation()
                nextActive()
              }}
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

        {photos.length > 1 && (
          <div className={styles.thumbsRow} role="list" aria-label="Все фото офиса">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                role="listitem"
                className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Фото ${i + 1}`}
                aria-pressed={i === activeIndex}
              >
                <Image
                  src={photo.url}
                  alt={`${alt} — фото ${i + 1}`}
                  fill
                  className={styles.thumbImg}
                  sizes="100px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {overlaySlot}
      </div>

      {/* Лайтбокс рендерится через портал в document.body */}
      {lightbox}
    </div>
  )
}
