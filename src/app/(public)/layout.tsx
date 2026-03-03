import { TopBar } from '@/widgets/top-bar'
import { Header } from '@/widgets/header'

// TODO Sprint 1: заменить на fetch('/api/settings') и fetch('/api/services') с ISR revalidate
const mockSettings = {
  phones: ['+7 (383) 000-00-00', '+7 (913) 000-00-00'],
  email: 'info@businesscenter.ru',
  address: 'г. Новосибирск, ул. Ленина, 105',
  socials: {
    vk: 'https://vk.com/example',
    wa: 'https://wa.me/73830000000',
    tg: 'https://t.me/example',
  },
}

const mockServices = [
  { title: 'Парковка', slug: 'parking' },
  { title: 'Реклама внутри здания', slug: 'advertising' },
  { title: 'Клининг', slug: 'cleaning' },
  { title: 'Охрана', slug: 'security' },
  { title: 'Почтовая ячейка', slug: 'mailbox' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar {...mockSettings} />
      <Header services={mockServices} />
      <main>{children}</main>
    </>
  )
}
