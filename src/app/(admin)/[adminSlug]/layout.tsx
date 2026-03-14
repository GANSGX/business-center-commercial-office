import dynamic from 'next/dynamic'
import styles from './admin-layout.module.css'

const AdminSidebar = dynamic(
  () => import('./_components/AdminSidebar').then((m) => m.AdminSidebar),
  { ssr: false }
)
const AdminTopbar = dynamic(() => import('./_components/AdminTopbar').then((m) => m.AdminTopbar), {
  ssr: false,
})

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
