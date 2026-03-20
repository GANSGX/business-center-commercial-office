'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './InBuildingPage.module.css'

interface Props {
  orgCount: number
}

export function InBuildingHero({ orgCount }: Props) {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('inbuilding-panel')
    if (!target) return

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
            В здании
          </li>
        </ol>
      </nav>

      <section ref={heroRef} className={styles.hero} aria-labelledby="inbuilding-title">
        <div className={styles.orbBlue} aria-hidden="true" />
        <div className={styles.orbAmber} aria-hidden="true" />
        <div className={styles.gridMesh} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Бизнес-центр «Коммунистическая, 35»</p>
          <h1 id="inbuilding-title" className={styles.heroTitle}>
            В здании
          </h1>
          <p className={styles.heroSubtitle}>
            Кафе, рестораны, магазины и сервисы на территории бизнес-центра
          </p>
          {orgCount > 0 && (
            <div className={styles.heroBadges}>
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span aria-label={`${orgCount} организаций`}>{orgCount}&nbsp;организаций</span>
              </span>

              <span className={styles.heroBadgeDot} aria-hidden="true" />

              <button
                type="button"
                className={styles.scrollBtn}
                onClick={scrollToContent}
                aria-label="Перейти к списку организаций"
              >
                Смотреть список
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
