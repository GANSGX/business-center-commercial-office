import type { Metadata } from 'next'
import { AboutPage } from './_page/AboutPage'

export const revalidate = 600

const TITLE = 'О нас — АО «Коммунистическая-35»'
const DESCRIPTION =
  'АО «Коммунистическая-35» — управляющая компания бизнес-центра в Новосибирске. ' +
  'Юридические реквизиты, банковские реквизиты, контактная информация и руководство организации.'

export const metadata: Metadata = {
  title: 'О нас',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/about',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/images/hero-1.png',
        width: 1200,
        height: 630,
        alt: 'Бизнес-центр АО «Коммунистическая-35» в Новосибирске',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/hero-1.png'],
  },
}

export default function Page() {
  return <AboutPage />
}
