'use client'

import dynamic from 'next/dynamic'
import { Modal } from '@/shared/ui'
import { useLeadModal } from '@/features/lead-submit'

const LeadForm = dynamic(() => import('./LeadForm').then((m) => ({ default: m.LeadForm })), {
  ssr: false,
})

export function LeadModal() {
  const { isOpen, close } = useLeadModal()

  return (
    <Modal open={isOpen} onClose={close} title="Оставить заявку">
      <LeadForm compact />
    </Modal>
  )
}
