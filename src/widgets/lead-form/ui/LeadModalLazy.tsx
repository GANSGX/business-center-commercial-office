'use client'

import dynamic from 'next/dynamic'

const LeadModal = dynamic(() => import('./LeadModal').then((m) => ({ default: m.LeadModal })), {
  ssr: false,
})

export function LeadModalLazy() {
  return <LeadModal />
}
