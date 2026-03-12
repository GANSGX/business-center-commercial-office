import type { MetadataRoute } from 'next'
import { MOCK_ROOMS } from '@/entities/room'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let rooms: { slug: string; updatedAt: Date }[] = []
  let services: { slug: string }[] = []

  try {
    const { prisma } = await import('@/shared/lib/prisma')
    rooms = await prisma.room.findMany({ select: { slug: true, updatedAt: true } })
    services = await prisma.service.findMany({ select: { slug: true } })
  } catch {
    // DB not available — fall back to mock data
    rooms = MOCK_ROOMS.map((r) => ({ slug: r.slug, updatedAt: new Date() }))
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/offices`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/location`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${BASE_URL}/offices/${room.slug}`,
    lastModified: room.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...roomRoutes, ...serviceRoutes]
}
