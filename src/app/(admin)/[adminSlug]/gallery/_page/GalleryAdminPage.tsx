'use client'

import { useState } from 'react'
import styles from './GalleryAdminPage.module.css'

const MOCK_GALLERY = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  url: `https://picsum.photos/seed/gallery-${i + 1}/800/600`,
  caption: i < 3 ? ['Вид на здание', 'Лобби БЦ', 'Переговорная'][i] : '',
}))

export function GalleryAdminPage() {
  const [photos, setPhotos] = useState(MOCK_GALLERY)

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Галерея</h1>
          <p className={styles.subtitle}>{photos.length} фотографий</p>
        </div>
        <button className={styles.uploadBtn}>
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
          Загрузить фото
        </button>
      </div>

      {/* Зона загрузки */}
      <div className={styles.dropzone}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className={styles.dropzoneText}>Перетащите фотографии сюда или нажмите для выбора</p>
        <span className={styles.dropzoneHint}>JPG, PNG, WebP до 10 МБ</span>
      </div>

      {/* Сетка фото */}
      <div className={styles.grid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <div className={styles.photoThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption || 'Фото'} loading="lazy" />
              <div className={styles.photoOverlay}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => removePhoto(photo.id)}
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
                <div className={styles.dragHandle} title="Перетащить">
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
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </div>
              </div>
            </div>
            <input
              className={styles.captionInput}
              placeholder="Подпись..."
              defaultValue={photo.caption}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
