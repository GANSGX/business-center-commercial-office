import type { Metadata } from 'next'
import { PrivacyPage } from './_page/PrivacyPage'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — АО «Коммунистическая-35»',
  description:
    'Политика обработки персональных данных АО «Коммунистическая-35». Информация о сборе, использовании и защите данных пользователей сайта.',
  robots: { index: false },
  alternates: { canonical: '/privacy' },
}

export default function Page() {
  return <PrivacyPage />
}
