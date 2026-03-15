import type { Room } from '../types'
import { prisma } from '@/shared/lib/prisma'

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: 'asc' } } },
  })
  return room as Room | null
}
