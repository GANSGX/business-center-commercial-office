import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const adminSlug = process.env.ADMIN_SLUG ?? '_admin'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [`/${adminSlug}/`, '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
