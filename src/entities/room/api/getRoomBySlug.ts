import 'server-only'
import type { Room } from '../types'
import { prisma } from '@/shared/lib/prisma'

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: { slug },
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
  if (!room) return null
  return room as Room
}
