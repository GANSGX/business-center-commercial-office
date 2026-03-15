import styles from './admin-layout.module.css'
import { AdminSidebar } from './_components/AdminSidebar'
import { AdminTopbar } from './_components/AdminTopbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
