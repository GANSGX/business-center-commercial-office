import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const room = await prisma.room.create({
    data: {
      title: 'Тестовый офис',
      slug: `test-room-${Date.now()}`,
      type: 'Офис',
      area: 45.0,
      floor: 3,
      priceMonth: 35000,
      status: 'FREE',
      layoutType: 'Открытая',
      internet: 'Оптоволокно',
      entrance: 'Главный',
      rentType: 'Долгосрочная',
      water: false,
      wc: false,
      windows: false,
      showOnHome: false,
      suitableFor: [],
    },
  })
  console.log('Created OK:', room.id)
  await prisma.room.delete({ where: { id: room.id } })
  console.log('Cleaned up')
}

main()
  .catch((e) => {
    console.error('FAILED:', e.message ?? e)
  })
  .finally(() => prisma.$disconnect())
