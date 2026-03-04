import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Бизнес-центр — аренда офисов',
    template: '%s | Бизнес-центр',
  },
  description:
    'Аренда офисных помещений в современном бизнес-центре. Свободные офисы, гибкие условия аренды.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
