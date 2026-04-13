'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './HeroSlidesPage.module.css'

interface Slide {
  id: string
  image: string
  order: number
  active: boolean
  title: string
}

export function HeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceIdRef = useRef<string | null>(null)

  useEffect(() => {
    fetch('/api/hero-slides?admin=true')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSlides(Array.isArray(data) ? data : []))
  }, [])

  async function toggleActive(id: string) {
    const slide = slides.find((s) => s.id === id)
    if (!slide) return
    const newActive = !slide.active
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: newActive } : s)))
    await fetch('/api/hero-slides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: newActive }),
    })
  }

  async function removeSlide(id: string) {
    if (!confirm('Удалить слайд?')) return
    setSlides((prev) => prev.filter((s) => s.id !== id))
    await fetch('/api/hero-slides', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function handleFileUpload(files: FileList | null, replaceId?: string) {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
      if (!uploadRes.ok) continue
      const { url } = await uploadRes.json()
      if (replaceId) {
        await fetch('/api/hero-slides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: replaceId, image: url }),
        })
        setSlides((prev) => prev.map((s) => (s.id === replaceId ? { ...s, image: url } : s)))
      } else {
        const order = slides.length
        const addRes = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: `Слайд ${order + 1}`, image: url, order, active: true }),
        })
        if (addRes.ok) {
          const slide = await addRes.json()
          setSlides((prev) => [...prev, slide])
        }
      }
    }
    setUploading(false)
  }

  const activeCount = slides.filter((s) => s.active).length

  return (
    <div className={styles.page}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (replaceIdRef.current) {
            handleFileUpload(e.target.files, replaceIdRef.current)
            replaceIdRef.current = null
          } else {
            handleFileUpload(e.target.files)
          }
          e.target.value = ''
        }}
      />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hero-слайдер</h1>
          <p className={styles.subtitle}>
            {slides.length} фото · {activeCount} активных
          </p>
        </div>
        <button
          className={styles.uploadBtn}
          onClick={() => {
            replaceIdRef.current = null
            fileInputRef.current?.click()
          }}
          disabled={uploading}
        >
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
          {uploading ? 'Загрузка...' : 'Добавить фото'}
        </button>
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
                <button
                  className={styles.actionBtn}
                  title="Заменить фото"
                  onClick={() => {
                    replaceIdRef.current = slide.id
                    fileInputRef.current?.click()
                  }}
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
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
        <button
          className={styles.addCard}
          onClick={() => {
            replaceIdRef.current = null
            fileInputRef.current?.click()
          }}
        >
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
        </button>
      </div>
    </div>
  )
}
