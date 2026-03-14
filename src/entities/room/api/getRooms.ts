import type { Room, RoomStatus } from '../types'
import { MOCK_ROOMS } from '../mock'

export type RoomSortOption = 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | ''

export interface GetRoomsParams {
  status?: RoomStatus | null
  sort?: RoomSortOption | null
  roomType?: string | null // 'Офис' | 'Склад' | null
  showOnHome?: boolean
}

// TODO Sprint 2: заменить на prisma.room.findMany({ where: {...}, include: { photos: { orderBy: { order: 'asc' } } } })
export async function getRooms(params: GetRoomsParams = {}): Promise<Room[]> {
  let rooms = [...MOCK_ROOMS]

  if (params.showOnHome) {
    rooms = rooms.filter((r) => r.showOnHome && r.status === 'FREE')
  } else {
    if (params.status) rooms = rooms.filter((r) => r.status === params.status)
    if (params.roomType) rooms = rooms.filter((r) => r.type === params.roomType)
  }

  const sort = params.sort
  if (sort === 'price_asc') rooms.sort((a, b) => a.priceMonth - b.priceMonth)
  else if (sort === 'price_desc') rooms.sort((a, b) => b.priceMonth - a.priceMonth)
  else if (sort === 'area_asc') rooms.sort((a, b) => a.area - b.area)
  else if (sort === 'area_desc') rooms.sort((a, b) => b.area - a.area)
  else {
    // По умолчанию: сначала свободные, потом забронированные, потом занятые
    const order: Record<RoomStatus, number> = { FREE: 0, RESERVED: 1, RENTED: 2 }
    rooms.sort((a, b) => order[a.status] - order[b.status])
  }

  return rooms
}
