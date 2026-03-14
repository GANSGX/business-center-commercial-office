'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './OfficesPage.module.css'

interface Props {
  total: number
  freeCount: number
}

export function OfficesHero({ total, freeCount }: Props) {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('offices-content')
    if (!target) return
    const OFFSET = 140
    const start = window.scrollY
    const end = target.getBoundingClientRect().top + start - OFFSET
    const duration = 900
    let startTime: number | null = null
    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const p = Math.min(elapsed / duration, 1)
      window.scrollTo(0, start + (end - start) * easeInOutQuart(p))
      if (p < 1) requestAnimationFrame(step)
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
          heroRef.current.style.filter = progress > 0 ? `blur(${(progress * 22).toFixed(1)}px)` : ''
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
      {/* Хлебные крошки — fixed */}
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
            Аренда офисов
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="offices-hero-title">
        <div className={styles.orbBlue} aria-hidden="true" />
        <div className={styles.orbAmber} aria-hidden="true" />
        <div className={styles.gridMesh} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Бизнес-центр «Коммунистическая, 35»</p>
          <h1 id="offices-hero-title" className={styles.heroTitle}>
            Аренда офисов
          </h1>
          <p className={styles.heroSubtitle}>
            Офисные помещения от {'\u00a0'}18 до 72{'\u00a0'}м² — выберите подходящий и оставьте
            заявку
          </p>

          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDotGreen} aria-hidden="true" />
              <span>{freeCount}&nbsp;свободных</span>
            </span>

            <span className={styles.heroBadgeDot} aria-hidden="true" />

            <span className={styles.heroBadge}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span>{total}&nbsp;помещений</span>
            </span>

            <span className={styles.heroBadgeDot} aria-hidden="true" />

            <button
              type="button"
              className={styles.scrollBtn}
              onClick={scrollToContent}
              aria-label="Перейти к каталогу офисов"
            >
              Смотреть офисы
              <svg
                width="13"
                height="13"
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
        </div>

        <div className={styles.heroFade} aria-hidden="true" />
      </section>
    </>
  )
}
