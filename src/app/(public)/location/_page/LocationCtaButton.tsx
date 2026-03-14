'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './LocationPage.module.css'

export function LocationCtaButton() {
  const { open } = useLeadModal()
  return (
    <button type="button" className={styles.ctaBtn} onClick={() => open()}>
      Оставить заявку
    </button>
  )
}
