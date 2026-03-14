'use client'

import dynamic from 'next/dynamic'

const LeadForm = dynamic(() => import('./LeadForm').then((m) => ({ default: m.LeadForm })), {
  ssr: false,
})

export function LeadFormLazy() {
  return <LeadForm />
}
