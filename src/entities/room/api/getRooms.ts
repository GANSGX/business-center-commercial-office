import 'server-only'
import type { Room, RoomStatus, RoomSortOption } from '../types'
import { prisma } from '@/shared/lib/prisma'

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
    select: {
      id: true,
      slug: true,
      title: true,
      buildingNumber: true,
      roomNumber: true,
      type: true,
      area: true,
      floor: true,
      layoutType: true,
      water: true,
      wc: true,
      windows: true,
      entrance: true,
      rentType: true,
      internet: true,
      minRentTerm: true,
      priceMonth: true,
      priceM2: true,
      hidePrice: true,
      description: true,
      suitableFor: true,
      status: true,
      showOnHome: true,
      photos: {
        orderBy: { order: 'asc' },
        select: { id: true, url: true, order: true },
      },
    },
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
