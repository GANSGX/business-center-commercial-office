'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './ContactsPage.module.css'

export function ContactsHero() {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToContent = useCallback(() => {
    const target = document.getElementById('contacts-content')
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
            Контакты
          </li>
        </ol>
      </nav>

      {/* ── Hero-секция с JS blur при скролле ── */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="contacts-title">
        <div className={styles.orbBlue} aria-hidden="true" />
        <div className={styles.orbGreen} aria-hidden="true" />
        <div className={styles.gridMesh} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Бизнес-центр «Коммунистическая, 35»</p>
          <h1 id="contacts-title" className={styles.heroTitle}>
            Контакты
          </h1>
          <p className={styles.heroSubtitle}>Свяжитесь с нами или приходите в&nbsp;гости</p>
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>г.&nbsp;Новосибирск</span>
            </span>

            <span className={styles.heroBadgeDot} aria-hidden="true" />

            <button
              type="button"
              className={styles.scrollBtn}
              onClick={scrollToContent}
              aria-label="Перейти к контактной информации"
            >
              Как связаться
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
