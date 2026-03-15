'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { Modal } from '@/shared/ui'
import { useLeadModal } from '@/features/lead-submit'

const LeadForm = dynamic(() => import('./LeadForm').then((m) => ({ default: m.LeadForm })), {
  ssr: false,
})

export function LeadModal() {
  const { isOpen, officeLabel, close } = useLeadModal()
  const pathname = usePathname()

  // Закрываем модалку при переходе на другую страницу
  useEffect(() => {
    close()
  }, [pathname, close])

  const title = officeLabel ? `Заявка — ${officeLabel}` : 'Оставить заявку'

  return (
    <Modal open={isOpen} onClose={close} title={title}>
      <LeadForm compact serviceName={officeLabel ?? undefined} />
    </Modal>
  )
}
