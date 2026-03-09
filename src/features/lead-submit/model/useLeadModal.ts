import { create } from 'zustand'

interface LeadModalStore {
  isOpen: boolean
  officeLabel: string | null
  open: (officeLabel?: string) => void
  close: () => void
}

export const useLeadModal = create<LeadModalStore>((set) => ({
  isOpen: false,
  officeLabel: null,
  open: (officeLabel) => set({ isOpen: true, officeLabel: officeLabel ?? null }),
  close: () => set({ isOpen: false, officeLabel: null }),
}))
