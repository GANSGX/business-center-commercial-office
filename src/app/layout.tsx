import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  )
}
