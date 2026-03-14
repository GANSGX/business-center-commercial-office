import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://kommunisticheskaya35.ru'
const ADMIN_SLUG = process.env.ADMIN_SLUG ?? '_admin'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [`/${ADMIN_SLUG}/`],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
