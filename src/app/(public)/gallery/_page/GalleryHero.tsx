'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './GalleryPage.module.css'

interface Props {
  imageCount: number
}

export function GalleryHero({ imageCount }: Props) {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToGrid = useCallback(() => {
    const target = document.getElementById('gallery-section-label')
    if (!target) return

    // Хлебные крошки fixed: top 104px + ~36px высота = 140px. +16px воздух = 156px
    const BREADCRUMB_CLEARANCE = 156
    const start = window.scrollY
    const end = target.getBoundingClientRect().top + start - BREADCRUMB_CLEARANCE
    const duration = 1000
    let startTime: number | null = null

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      window.scrollTo(0, start + (end - start) * easeInOutQuart(progress))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    let rafId: number | null = null
    const vh = window.innerHeight

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const progress = Math.min(window.scrollY / (vh * 0.4), 1)
        if (heroRef.current) {
          heroRef.current.style.filter = progress > 0 ? `blur(${(progress * 24).toFixed(1)}px)` : ''
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* ── Хлебные крошки — fixed, не уезжают под шапку ── */}
      <nav className={styles.breadcrumb} aria-label="Хлебные крошки">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/" className={styles.crumbLink}>
              Главная
            </Link>
          </li>
          <li aria-hidden="true" className={styles.crumbSep}>
            ›
          </li>
          <li className={styles.crumbCurrent} aria-current="page">
            Фотогалерея
          </li>
        </ol>
      </nav>

      {/* ── Hero-секция с JS blur при скролле ── */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="gallery-title">
        <div className={styles.orbBlue} aria-hidden="true" />
        <div className={styles.orbAmber} aria-hidden="true" />
        <div className={styles.gridMesh} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Бизнес-центр «Коммунистическая, 35»</p>
          <h1 id="gallery-title" className={styles.heroTitle}>
            Фотогалерея
          </h1>
          <p className={styles.heroSubtitle}>Интерьеры, офисные пространства и инфраструктура</p>
          {imageCount > 0 && (
            <div className={styles.heroBadges}>
              {/* Счётчик — динамически из props */}
              <span className={styles.heroBadge}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span aria-label={`${imageCount} фотографий`}>{imageCount}&nbsp;фотографий</span>
              </span>

              <span className={styles.heroBadgeDot} aria-hidden="true" />

              {/* Кнопка скролла — интерактивная */}
              <button
                type="button"
                className={styles.scrollBtn}
                onClick={scrollToGrid}
                aria-label="Перейти к фотографиям"
              >
                Смотреть фото
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className={styles.heroFade} aria-hidden="true" />
      </section>
    </>
  )
}
