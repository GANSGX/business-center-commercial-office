import type { Room, RoomStatus } from '../types'
import { prisma } from '@/shared/lib/prisma'

export type RoomSortOption = 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | ''

export interface GetRoomsParams {
  status?: RoomStatus | null
  sort?: RoomSortOption | null
  roomType?: string | null // 'Офис' | 'Склад' | null
  showOnHome?: boolean
}

export async function getRooms(params: GetRoomsParams = {}): Promise<Room[]> {
  const where: Record<string, unknown> = {}

  if (params.showOnHome) {
    where.showOnHome = true
    where.status = 'FREE'
  } else {
    if (params.status) where.status = params.status
    if (params.roomType) where.type = params.roomType
  }

  const rooms = await prisma.room.findMany({
    where,
    include: { photos: { orderBy: { order: 'asc' } } },
  })

  const sort = params.sort
  if (sort === 'price_asc') rooms.sort((a, b) => a.priceMonth - b.priceMonth)
  else if (sort === 'price_desc') rooms.sort((a, b) => b.priceMonth - a.priceMonth)
  else if (sort === 'area_asc') rooms.sort((a, b) => a.area - b.area)
  else if (sort === 'area_desc') rooms.sort((a, b) => b.area - a.area)
  else {
    const order: Record<RoomStatus, number> = { FREE: 0, RESERVED: 1, RENTED: 2 }
    rooms.sort((a, b) => order[a.status as RoomStatus] - order[b.status as RoomStatus])
  }

  return rooms as Room[]
}
