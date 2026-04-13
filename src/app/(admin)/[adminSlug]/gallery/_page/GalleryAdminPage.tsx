'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './GalleryAdminPage.module.css'

interface GalleryImage {
  id: string
  url: string
  caption?: string | null
  order: number
}

export function GalleryAdminPage() {
  const [photos, setPhotos] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
      if (!uploadRes.ok) continue
      const { url } = await uploadRes.json()
      const order = photos.length
      const addRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, order }),
      })
      if (addRes.ok) {
        const photo = await addRes.json()
        setPhotos((prev) => [...prev, photo])
      }
    }
    setUploading(false)
  }

  async function removePhoto(id: string) {
    if (!confirm('Удалить фото?')) return
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function updateCaption(id: string, caption: string) {
    await fetch('/api/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, caption }),
    })
  }

  return (
    <div className={styles.page}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleUpload(e.target.files)}
      />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Галерея</h1>
          <p className={styles.subtitle}>{photos.length} фотографий</p>
        </div>
        <button
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
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
          {uploading ? 'Загрузка...' : 'Загрузить фото'}
        </button>
      </div>

      {/* Зона загрузки */}
      <div
        className={styles.dropzone}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
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

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Загрузка...
        </div>
      ) : (
        /* Сетка фото */
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
                defaultValue={photo.caption ?? ''}
                onBlur={(e) => updateCaption(photo.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
