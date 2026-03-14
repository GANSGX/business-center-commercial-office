import type { Room } from '../types'
import { MOCK_ROOMS } from '../mock'

// TODO Sprint 1: заменить на prisma.room.findUnique({ where: { slug }, include: { photos: { orderBy: { order: 'asc' } } } })
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  return MOCK_ROOMS.find((r) => r.slug === slug) ?? null
}
