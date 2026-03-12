'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './LocationPage.module.css'

export function LocationHero() {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('location-content')
    if (!target) return
    const CLEARANCE = 156
    const start = window.scrollY
    const end = target.getBoundingClientRect().top + start - CLEARANCE
    const duration = 1000
    let startTime: number | null = null
    const ease = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      window.scrollTo(0, start + (end - start) * ease(p))
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
            Расположение
          </li>
        </ol>
      </nav>

      <section ref={heroRef} className={styles.hero} aria-labelledby="location-title">
        <div className={styles.orbGreen} aria-hidden="true" />
        <div className={styles.orbTeal} aria-hidden="true" />
        <div className={styles.gridMesh} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Бизнес-центр «Коммунистическая, 35»</p>
          <h1 id="location-title" className={styles.heroTitle}>
            Расположение
          </h1>
          <p className={styles.heroSubtitle}>
            В&nbsp;самом центре Новосибирска, в&nbsp;5&nbsp;минутах от&nbsp;метро
          </p>
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
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>5 мин от метро</span>
            </span>

            <span className={styles.heroBadgeDot} aria-hidden="true" />

            <button
              type="button"
              className={styles.scrollBtn}
              onClick={scrollToContent}
              aria-label="Перейти к карте"
            >
              Показать на карте
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
        </div>

        <div className={styles.heroFade} aria-hidden="true" />
      </section>
    </>
  )
}
