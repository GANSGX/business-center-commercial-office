'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { Modal } from '@/shared/ui'
import { useTenantPlacementModal } from '../model/useTenantPlacementModal'

const TenantPlacementForm = dynamic(
  () => import('./TenantPlacementForm').then((m) => ({ default: m.TenantPlacementForm })),
  { ssr: false }
)

export function TenantPlacementModal() {
  const { isOpen, close } = useTenantPlacementModal()
  const pathname = usePathname()

  useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <Modal open={isOpen} onClose={close} title="Разместить компанию в справочнике">
      <TenantPlacementForm />
    </Modal>
  )
}
