'use client'

import { useState } from 'react'
import styles from './HeroSlidesPage.module.css'

interface Slide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonUrl: string
  image: string
  order: number
  active: boolean
}

const MOCK_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Аренда офисов класса A',
    subtitle: 'Бизнес-центр «Коммунистическая 35» — в сердце Новосибирска',
    buttonText: 'Смотреть помещения',
    buttonUrl: '/offices',
    image: 'https://picsum.photos/seed/hero-1/1200/600',
    order: 0,
    active: true,
  },
  {
    id: '2',
    title: 'Склады и производственные помещения',
    subtitle: 'От 50 до 500 м² — готовы к въезду',
    buttonText: 'Подобрать склад',
    buttonUrl: '/offices?type=warehouse',
    image: 'https://picsum.photos/seed/hero-2/1200/600',
    order: 1,
    active: true,
  },
  {
    id: '3',
    title: 'Дополнительные услуги',
    subtitle: 'Переговорные комнаты, парковка, охрана',
    buttonText: 'Узнать подробнее',
    buttonUrl: '/services',
    image: 'https://picsum.photos/seed/hero-3/1200/600',
    order: 2,
    active: false,
  },
]

export function HeroSlidesPage() {
  const [slides, setSlides] = useState(MOCK_SLIDES)
  const [editingId, setEditingId] = useState<string | null>(null)

  function toggleActive(id: string) {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  function removeSlide(id: string) {
    setSlides((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hero-слайды</h1>
          <p className={styles.subtitle}>{slides.length} слайдов</p>
        </div>
        <button className={styles.addBtn}>
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
          Добавить слайд
        </button>
      </div>

      <div className={styles.list}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`${styles.card} ${!slide.active ? styles.cardInactive : ''}`}
          >
            <div className={styles.dragHandle} title="Перетащить">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>

            <div className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt={slide.title} loading="lazy" />
              <span className={styles.orderBadge}>{idx + 1}</span>
            </div>

            <div className={styles.info}>
              <div className={styles.slideTitle}>{slide.title}</div>
              <div className={styles.slideSubtitle}>{slide.subtitle}</div>
              <div className={styles.slideMeta}>
                <span className={styles.metaItem}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {slide.buttonUrl}
                </span>
                <span className={styles.metaItem}>Кнопка: «{slide.buttonText}»</span>
              </div>
            </div>

            <div className={styles.actions}>
              <label className={styles.toggle} title={slide.active ? 'Скрыть' : 'Показать'}>
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={() => toggleActive(slide.id)}
                />
                <span className={styles.toggleTrack} />
              </label>
              <button
                className={styles.actionBtn}
                onClick={() => setEditingId(slide.id)}
                title="Редактировать"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
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
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
