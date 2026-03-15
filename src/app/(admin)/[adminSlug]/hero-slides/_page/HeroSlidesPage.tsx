'use client'

import { useState } from 'react'
import styles from './HeroSlidesPage.module.css'

interface Slide {
  id: string
  image: string
  order: number
  active: boolean
}

const MOCK_SLIDES: Slide[] = [
  { id: '1', image: 'https://picsum.photos/seed/hero-1/800/400', order: 0, active: true },
  { id: '2', image: 'https://picsum.photos/seed/hero-2/800/400', order: 1, active: true },
  { id: '3', image: 'https://picsum.photos/seed/hero-3/800/400', order: 2, active: false },
]

export function HeroSlidesPage() {
  const [slides, setSlides] = useState(MOCK_SLIDES)

  function toggleActive(id: string) {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  function removeSlide(id: string) {
    if (!confirm('Удалить слайд?')) return
    setSlides((prev) => prev.filter((s) => s.id !== id))
  }

  const activeCount = slides.filter((s) => s.active).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hero-слайдер</h1>
          <p className={styles.subtitle}>
            {slides.length} фото · {activeCount} активных
          </p>
        </div>
        <label className={styles.uploadBtn}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Добавить фото
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} />
        </label>
      </div>

      <div className={styles.hint}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Рекомендуемый размер фото: 1920×800 px. Порядок слайдов — перетащите карточки.
      </div>

      <div className={styles.grid}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`${styles.card} ${!slide.active ? styles.cardInactive : ''}`}
          >
            <div className={styles.orderBadge}>{idx + 1}</div>

            <div className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt={`Слайд ${idx + 1}`} loading="lazy" />
            </div>

            <div className={styles.cardFooter}>
              <label
                className={styles.toggle}
                title={slide.active ? 'Скрыть слайд' : 'Показать слайд'}
              >
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={() => toggleActive(slide.id)}
                />
                <span className={styles.toggleTrack} />
                <span className={styles.toggleLabel}>{slide.active ? 'Активен' : 'Скрыт'}</span>
              </label>

              <div className={styles.actions}>
                <label className={styles.actionBtn} title="Заменить фото">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                  onClick={() => removeSlide(slide.id)}
                  title="Удалить"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Заглушка добавления */}
        <label className={styles.addCard}>
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Добавить фото</span>
        </label>
      </div>
    </div>
  )
}
