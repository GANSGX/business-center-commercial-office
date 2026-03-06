'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { IconMenu, IconClose, IconChevronDown } from '@/shared/ui/icons'
import { LogoLink } from '@/shared/ui'
import { useLeadModal } from '@/features/lead-submit'
import type { HeaderProps } from '../types'
import styles from './Header.module.css'

const NAV_LINKS = [
  { href: '/offices', label: 'Аренда офисов' },
  { href: '/gallery', label: 'Фотогалерея' },
  { href: '/contacts#map', label: 'Расположение' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
]

export function Header({ services }: HeaderProps) {
  const pathname = usePathname()
  const openModal = useLeadModal((s) => s.open)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [drawerServicesOpen, setDrawerServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!servicesOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [servicesOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false)
        setDrawerOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const handleCta = useCallback(() => {
    if (pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      openModal()
    }
  }, [pathname, openModal])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && (pathname ?? '').startsWith(href + '/'))

  const isServicesActive = services.some((s) => (pathname ?? '').startsWith(`/services/${s.slug}`))

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <LogoLink className={styles.logo} aria-label="На главную">
            <div className={styles.logoMark}>
              <span>БЦ</span>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Коммунистическая-35</span>
              <span className={styles.logoSub}>Бизнес-центр</span>
            </div>
          </LogoLink>

          {/* Desktop navigation */}
          <nav className={styles.nav} aria-label="Основная навигация">
            <Link
              href="/offices"
              className={`${styles.navLink} ${isActive('/offices') ? styles.active : ''}`}
            >
              Аренда офисов
            </Link>

            {/* Services dropdown */}
            {services.length > 0 && (
              <div className={styles.navItemWithDropdown} ref={dropdownRef}>
                <button
                  className={`${styles.navDropdownTrigger} ${servicesOpen || isServicesActive ? styles.active : ''}`}
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  aria-haspopup="menu"
                >
                  Доп. услуги
                  <IconChevronDown
                    size={14}
                    className={`${styles.chevron} ${servicesOpen ? styles.chevronOpen : ''}`}
                  />
                </button>

                <div
                  className={`${styles.dropdown} ${servicesOpen ? styles.dropdownOpen : ''}`}
                  role="menu"
                >
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className={styles.dropdownLink}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {NAV_LINKS.slice(1).map((link) => (
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
          <button onClick={handleCta} className={styles.ctaButton}>
            Оставить заявку
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
            <div className={styles.logoMark}>
              <span>БЦ</span>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Коммунистическая-35</span>
            </div>
          </LogoLink>
          <button className={styles.drawerClose} onClick={closeDrawer} aria-label="Закрыть меню">
            <IconClose size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Мобильная навигация">
          <Link
            href="/offices"
            className={`${styles.drawerLink} ${isActive('/offices') ? styles.active : ''}`}
            onClick={closeDrawer}
          >
            Аренда офисов
          </Link>

          {services.length > 0 && (
            <div>
              <button
                className={`${styles.accordionTrigger} ${drawerServicesOpen ? styles.accordionOpen : ''}`}
                onClick={() => setDrawerServicesOpen((v) => !v)}
                aria-expanded={drawerServicesOpen}
              >
                Доп. услуги
                <IconChevronDown
                  size={16}
                  className={`${styles.chevron} ${drawerServicesOpen ? styles.chevronOpen : ''}`}
                />
              </button>
              <div
                className={`${styles.accordionContent} ${drawerServicesOpen ? styles.accordionContentOpen : ''}`}
              >
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className={styles.accordionLink}
                    onClick={closeDrawer}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {NAV_LINKS.slice(1).map((link) => (
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
            className={styles.ctaButtonFull}
            onClick={() => {
              closeDrawer()
              handleCta()
            }}
          >
            Оставить заявку
          </button>
        </div>
      </aside>
    </>
  )
}
