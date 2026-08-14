export type RoomStatus = 'FREE' | 'RESERVED' | 'RENTED'
export type RoomSortOption = 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | ''

export interface RoomPhoto {
  id: string
  url: string
  order: number
}

export interface Room {
  id: string
  slug: string
  title: string
  buildingNumber: string | null
  roomNumber: string | null
  type: string | null
  area: number
  floor: number
  layoutType: string | null
  water: boolean
  wc: boolean
  windows: boolean
  entrance: string | null
  rentType: string | null
  internet: string | null
  minRentTerm: string | null
  priceMonth: number
  priceM2: number | null
  hidePrice: boolean
  description: string | null
  suitableFor: string[]
  status: RoomStatus
  showOnHome: boolean
  photos: RoomPhoto[]
}
