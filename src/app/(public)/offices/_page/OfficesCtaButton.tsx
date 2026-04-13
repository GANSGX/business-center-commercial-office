'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './OfficesPage.module.css'

export function OfficesCtaButton() {
  const open = useLeadModal((s) => s.open)
  return (
    <button type="button" className={styles.ctaBtn} onClick={() => open()}>
      Оставить заявку
    </button>
  )
}
