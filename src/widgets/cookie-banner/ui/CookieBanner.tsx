'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

const STORAGE_KEY = 'cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Показываем только если пользователь ещё не сделал выбор
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent-accepted'))
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-label="Уведомление об использовании файлов cookie"
    >
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.title}>Мы используем файлы cookie</p>
          <p className={styles.desc}>
            <span className={styles.descText}>
              Сайт использует технические cookie для корректной работы. Они не передаются третьим
              лицам и не используются для рекламы.{' '}
            </span>
            <Link href="/privacy" className={styles.link}>
              Политика конфиденциальности
            </Link>
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnDecline} onClick={decline}>
            Только необходимые
          </button>
          <button className={styles.btnAccept} onClick={accept}>
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}
