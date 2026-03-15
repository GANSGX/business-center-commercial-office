'use client'

import Link from 'next/link'
import { usePathname, useParams, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSidebarStore } from '@/features/admin-sidebar'
import styles from './AdminSidebar.module.css'
import { useEffect, useState } from 'react'

// ── Inline SVG icons ────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function IconRooms() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconLeads() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconGallery() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
function IconSlides() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3H8" />
      <path d="M12 3v4" />
    </svg>
  )
}
function IconAnalytics() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
function IconExternalLink() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

// ── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { segment: '', label: 'Дашборд', icon: <IconDashboard /> },
  { segment: 'rooms', label: 'Помещения', icon: <IconRooms /> },
  { segment: 'leads', label: 'Заявки', icon: <IconLeads /> },
  { segment: 'gallery', label: 'Галерея', icon: <IconGallery /> },
  { segment: 'analytics', label: 'Аналитика', icon: <IconAnalytics /> },
  { segment: 'settings', label: 'Настройки', icon: <IconSettings /> },
]

// ── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const slug = params.adminSlug as string
  const base = `/${slug}`

  const { isOpen, close } = useSidebarStore()

  const [newLeadsCount, setNewLeadsCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchNewLeads() {
      try {
        const res = await fetch('/api/leads?status=NEW&limit=1', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setNewLeadsCount(data.total ?? 0)
      } catch {
        /* ignore */
      }
    }

    fetchNewLeads()

    // SSE для мгновенного обновления бейджа
    const es = new EventSource('/api/leads/stream')
    es.onmessage = (e) => {
      if (e.data === 'new-lead') fetchNewLeads()
    }
    es.onerror = () => es.close()

    // Резервный поллинг раз в 60 сек
    const fallback = setInterval(fetchNewLeads, 60_000)

    return () => {
      cancelled = true
      es.close()
      clearInterval(fallback)
    }
  }, [])

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push(`/${slug}/login`)
  }

  function isActive(segment: string) {
    const href = segment === '' ? base : `${base}/${segment}`
    if (segment === '') return pathname === base || pathname === `${base}/`
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Backdrop для мобильного */}
      {isOpen && <div className={styles.backdrop} onClick={close} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Бренд */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>КМ</div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Коммунистическая-35</span>
            <span className={styles.brandRole}>Панель управления</span>
          </div>
        </div>

        {/* Навигация */}
        <nav className={styles.nav} aria-label="Навигация">
          {NAV_ITEMS.map(({ segment, label, icon }) => {
            const href = segment === '' ? base : `${base}/${segment}`
            const active = isActive(segment)
            const badge = segment === 'leads' ? newLeadsCount : 0
            return (
              <Link
                key={segment}
                href={href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                onClick={close}
              >
                <span className={styles.navIcon}>{icon}</span>
                <span className={styles.navLabel}>{label}</span>
                {badge > 0 && <span className={styles.navBadge}>{badge}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Футер */}
        <div className={styles.footer}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            <IconExternalLink />
            Перейти на сайт
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <IconLogout />
            Выйти
          </button>
        </div>
      </aside>
    </>
  )
}
