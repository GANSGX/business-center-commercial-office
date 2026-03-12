'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './GalleryPage.module.css'

export function GalleryCtaButton() {
  const { open } = useLeadModal()
  return (
    <button type="button" className={styles.ctaBtn} onClick={() => open()}>
      Записаться на просмотр
    </button>
  )
}
