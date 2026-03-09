import type { Metadata } from 'next'
import { AboutPage } from './_page/AboutPage'

export const revalidate = 600

const TITLE = 'О компании — АО «Коммунистическая-35»'
const DESCRIPTION =
  'АО «Коммунистическая-35» — управляющая компания бизнес-центра в Новосибирске. ' +
  'Юридические реквизиты, банковские реквизиты, контактная информация и руководство организации.'

export const metadata: Metadata = {
  title: 'О компании',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/about',
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
  return <AboutPage />
}
