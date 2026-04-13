import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Remove old composite keys
  await prisma.siteSettings.deleteMany({ where: { key: { in: ['phones', 'socials'] } } })

  const items = [
    { key: 'phone1', value: '+7 (383) 223-43-50' },
    { key: 'phone2', value: '+7 (383) 217-80-07' },
    { key: 'email', value: 'kommunist35@mail.ru' },
    { key: 'address', value: '630007, г. Новосибирск, ул. Коммунистическая, 35' },
    { key: 'workHours', value: 'Пн–Пт: 9:00–18:00' },
    { key: 'socialVk', value: '' },
    { key: 'socialTg', value: '' },
    { key: 'socialWa', value: '' },
    { key: 'socialAvito', value: '' },
    { key: 'mapProvider', value: 'yandex' },
    { key: 'mapLat', value: '54.9965' },
    { key: 'mapLng', value: '82.9167' },
    { key: 'mapZoom', value: '16' },
  ]

  for (const item of items) {
    await prisma.siteSettings.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    })
  }

  const all = await prisma.siteSettings.findMany({ orderBy: { key: 'asc' } })
  console.log('Settings updated:')
  all.forEach((s) => console.log(`  ${s.key} = ${s.value.substring(0, 40)}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
