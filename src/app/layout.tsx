import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Preloader } from '@/shared/ui'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Бизнес-центр «Коммунистическая-35» — аренда офисов в Новосибирске',
    template: '%s | Коммунистическая-35',
  },
  description:
    'Аренда офисов от 8 до 150 м² в центре Новосибирска. Класс Б+, 5–10 минут до метро «Площадь Ленина», бесплатная парковка, охрана 24/7.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>
        <Preloader />
        {children}
      </body>
    </html>
  )
}
