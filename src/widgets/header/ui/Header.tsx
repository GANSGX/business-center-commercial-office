'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { IconMenu, IconClose } from '@/shared/ui/icons'
import { LogoLink } from '@/shared/ui'
import { useLeadModal } from '@/features/lead-submit'
import styles from './Header.module.css'

const NAV_LINKS = [
  { href: '/offices', label: 'Аренда офисов' },
  { href: '/in-building', label: 'В здании' },
  { href: '/gallery', label: 'Фотогалерея' },
  { href: '/location', label: 'Расположение' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
]

export function Header() {
  const pathname = usePathname()
  const openModal = useLeadModal((s) => s.open)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Scroll detection — RAF throttle чтобы не тригерить ре-рендер на каждый пиксель
  useEffect(() => {
    let rafId: number
    const handler = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 10))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll when drawer is open (включая iOS Safari)
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [drawerOpen])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const handleCta = useCallback(() => {
    if (pathname === '/' || pathname === '/contacts') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      openModal()
    }
  }, [pathname, openModal])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && (pathname ?? '').startsWith(href + '/'))

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <LogoLink className={styles.logo} aria-label="На главную">
            <Image
              src="/images/logo_new.svg"
              alt="БЦ Коммунистическая-35"
              width={954}
              height={781}
              className={styles.logoImg}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Коммунистическая-35</span>
              <span className={styles.logoSub}>Бизнес-центр</span>
            </div>
          </LogoLink>

          {/* Desktop navigation */}
          <nav className={styles.nav} aria-label="Основная навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            type="button"
            onClick={handleCta}
            className={styles.ctaButton}
            aria-haspopup={pathname !== '/' ? 'dialog' : undefined}
          >
            Нужен офис?
          </button>

          {/* Burger button */}
          <button
            className={styles.burger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню навигации"
            aria-expanded={drawerOpen}
          >
            <IconMenu size={22} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayOpen : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-label="Мобильное меню"
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHeader}>
          <LogoLink className={styles.logo} aria-label="На главную" onClick={closeDrawer}>
            <Image
              src="/images/logo_new.svg"
              alt="БЦ Коммунистическая-35"
              width={954}
              height={781}
              className={styles.logoImg}
            />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Коммунистическая-35</span>
            </div>
          </LogoLink>
          <button className={styles.drawerClose} onClick={closeDrawer} aria-label="Закрыть меню">
            <IconClose size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Мобильная навигация">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.drawerLink} ${isActive(link.href) ? styles.active : ''}`}
              onClick={closeDrawer}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.drawerCta}>
          <button
            type="button"
            className={styles.ctaButtonFull}
            aria-haspopup={pathname !== '/' ? 'dialog' : undefined}
            onClick={() => {
              closeDrawer()
              handleCta()
            }}
          >
            Нужен офис?
          </button>
        </div>
      </aside>
    </>
  )
}
