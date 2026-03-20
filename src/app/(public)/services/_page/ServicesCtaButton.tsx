'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './ServicesPage.module.css'

export function ServicesCtaButton() {
  const open = useLeadModal((s) => s.open)
  return (
    <button type="button" className={styles.ctaBtn} onClick={() => open()}>
      Оставить заявку
    </button>
  )
}
