import { create } from 'zustand'

interface LeadModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useLeadModal = create<LeadModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
