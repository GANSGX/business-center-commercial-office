import { Header } from '@/widgets/header'
import styles from './layout.module.css'

// TODO Sprint 1: заменить на fetch('/api/services') с ISR revalidate
const mockServices = [
  { title: 'Парковка', slug: 'parking' },
  { title: 'Реклама внутри здания', slug: 'advertising' },
  { title: 'Клининг', slug: 'cleaning' },
  { title: 'Охрана', slug: 'security' },
  { title: 'Почтовая ячейка', slug: 'mailbox' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <Header services={mockServices} />
      <main>{children}</main>
    </div>
  )
}
