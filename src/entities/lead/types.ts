export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'PROCESSED'

export interface Lead {
  id: string
  createdAt: string
  name: string
  phone: string
  email: string | null
  message: string | null
  roomId: string | null
  roomTitle: string | null
  serviceName: string | null
  status: LeadStatus
}
