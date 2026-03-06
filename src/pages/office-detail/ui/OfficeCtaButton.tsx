'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './OfficePage.module.css'

interface Props {
  label?: string
}

export function OfficeCtaButton({ label = 'Оставить заявку' }: Props) {
  const open = useLeadModal((s) => s.open)
  return (
    <button type="button" onClick={open} className={styles.ctaBtn}>
      {label}
    </button>
  )
}
