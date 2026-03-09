'use client'

import { useLeadModal } from '@/features/lead-submit'
import styles from './OfficePage.module.css'

interface Props {
  label?: string
  officeLabel?: string
}

export function OfficeCtaButton({ label = 'Оставить заявку', officeLabel }: Props) {
  const open = useLeadModal((s) => s.open)
  return (
    <button type="button" onClick={() => open(officeLabel)} className={styles.ctaBtn}>
      {label}
    </button>
  )
}
