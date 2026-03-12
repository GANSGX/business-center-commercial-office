'use client'

import { useEffect, useRef } from 'react'
import styles from './Preloader.module.css'

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const dismiss = () => {
      // Небольшой буфер после window.load — даём Swiper и прочим JS инициализироваться
      setTimeout(() => {
        if (el) el.dataset.ready = 'true'
      }, 250)
    }

    if (document.readyState === 'complete') {
      dismiss()
    } else {
      window.addEventListener('load', dismiss, { once: true })
    }

    return () => window.removeEventListener('load', dismiss)
  }, [])

  return (
    <div ref={ref} className={styles.overlay} aria-hidden="true">
      <div className={styles.spinner} />
      <div className={styles.text}>
        <span className={styles.title}>Строим страницу для вас 🏗️</span>
        <span className={styles.sub}>уже почти готово</span>
      </div>
    </div>
  )
}
