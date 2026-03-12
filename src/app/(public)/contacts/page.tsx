import type { Metadata } from 'next'
import { ContactsPage } from './_page/ContactsPage'

export const revalidate = 600

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'
const TITLE = 'Контакты — Бизнес-центр Коммунистическая, 35'
const DESCRIPTION =
  'Телефоны, e-mail и схема проезда к бизнес-центру Коммунистическая, 35 в Новосибирске. ' +
  'Метро «Площадь Ленина» — 5 минут пешком. Оставьте заявку на аренду офиса онлайн.'

export const metadata: Metadata = {
  title: 'Контакты',
  description: DESCRIPTION,
  alternates: { canonical: '/contacts' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/contacts`,
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function Page() {
  return <ContactsPage />
}
