import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Страница не найдена',
}

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{ fontSize: '6rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            margin: '1rem 0 2rem',
          }}
        >
          Страница не найдена
        </p>
        <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--color-accent)' }}>
            Главная
          </Link>
          <Link href="/offices" style={{ color: 'var(--color-accent)' }}>
            Офисы
          </Link>
          <Link href="/services" style={{ color: 'var(--color-accent)' }}>
            Услуги
          </Link>
          <Link href="/contacts" style={{ color: 'var(--color-accent)' }}>
            Контакты
          </Link>
        </nav>
      </div>
    </main>
  )
}
