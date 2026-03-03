import { TopBar } from '@/widgets/top-bar'
import { Header } from '@/widgets/header'

// TODO Sprint 1: заменить на fetch('/api/settings') и fetch('/api/services') с ISR revalidate
const mockSettings = {
  phones: ['+7 (999) 123-45-67', '+7 (999) 765-43-21'],
  email: 'info@businesscenter.ru',
  address: 'г. Москва, ул. Примерная, 1',
  socials: {
    vk: 'https://vk.com/example',
    wa: 'https://wa.me/79991234567',
    tg: 'https://t.me/example',
  },
}

const mockServices = [
  { title: 'Интернет и телефония', slug: 'internet' },
  { title: 'Парковка', slug: 'parking' },
  { title: 'Переговорные комнаты', slug: 'meeting-rooms' },
  { title: 'Реклама на фасаде', slug: 'advertising' },
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
