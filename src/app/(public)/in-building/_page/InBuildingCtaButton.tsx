'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './InBuildingPage.module.css'

export function InBuildingCtaButton() {
  const open = useLeadModal((s) => s.open)
  return (
    <button type="button" className={styles.ctaBtn} onClick={() => open()}>
      Оставить заявку
    </button>
  )
}
