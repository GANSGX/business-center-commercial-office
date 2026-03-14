'use client'

import { usePathname, useParams } from 'next/navigation'
import { useSidebarStore } from '@/features/admin-sidebar'
import styles from './AdminTopbar.module.css'

const LABELS: Record<string, string> = {
  '': 'Дашборд',
  rooms: 'Помещения',
  leads: 'Заявки',
  gallery: 'Галерея',
  'hero-slides': 'Слайдер',
  settings: 'Настройки',
}

export function AdminTopbar() {
  const { toggle } = useSidebarStore()
  const pathname = usePathname()
  const params = useParams()
  const slug = params.adminSlug as string

  const segment = pathname.replace(`/${slug}`, '').split('/').filter(Boolean)[0] ?? ''
  const label = LABELS[segment] ?? 'Админка'

  return (
    <header className={styles.topbar}>
      <button className={styles.burger} onClick={toggle} aria-label="Открыть меню">
        <span />
        <span />
        <span />
      </button>
      <span className={styles.pageTitle}>{label}</span>
    </header>
  )
}
