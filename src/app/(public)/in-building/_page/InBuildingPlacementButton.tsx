'use client'

import { useTenantPlacementModal } from '@/features/tenant-placement'
import styles from './InBuildingPage.module.css'

export function InBuildingPlacementButton() {
  const open = useTenantPlacementModal((s) => s.open)
  return (
    <button type="button" className={styles.ctaBtn} onClick={open}>
      Подать заявку на размещение
    </button>
  )
}
