'use client'

import { usePathname, useParams } from 'next/navigation'
import styles from './admin-layout.module.css'
import { AdminSidebar } from './_components/AdminSidebar'
import { AdminTopbar } from './_components/AdminTopbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const adminSlug = params.adminSlug as string

  if (pathname === `/${adminSlug}/login`) {
    return <>{children}</>
  }

  return (
    <div className={styles.adminRoot}>
      <AdminSidebar />
      <div className={styles.main}>
        <AdminTopbar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
