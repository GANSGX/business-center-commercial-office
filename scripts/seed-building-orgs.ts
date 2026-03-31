/**
 * Скрипт для заполнения таблицы BuildingOrg данными об арендаторах.
 * Запуск: npx tsx scripts/seed-building-orgs.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const ORGS = [
  {
    name: 'ТКБ Банк',
    category: 'bank',
    color: 'blue',
    floor: 1,
    order: 0,
    logo: '/images/logo_part/ТКБ Банк.png',
    website: 'https://www.tkbbank.ru',
    description:
      'Российский банк с более чем 30-летней историей. Услуги для частных лиц и бизнеса: карты, вклады, ипотека, кредитование МСБ, ВЭД, эквайринг.',
  },
  {
    name: 'СберПраво',
    category: 'service',
    color: 'green',
    floor: 1,
    order: 1,
    logo: '/images/logo_part/сбер право.png',
    website: 'https://sberpravo.ru',
    description:
      'Юридический сервис экосистемы Сбера. Консультации, подготовка документов, судебное представительство, банкротство физических лиц.',
  },
  {
    name: 'I Dolci',
    category: 'food',
    color: 'amber',
    floor: 1,
    order: 2,
    logo: '/images/logo_part/I Dolci.png',
    website: 'https://idolci.ru',
    description:
      'Кафе-кондитерская с натуральными десертами ручной работы: торты, пирожные, чизкейки. Детские мастер-классы и кейтеринг.',
  },
  {
    name: 'Русский Фейерверк',
    category: 'retail',
    color: 'red',
    floor: 1,
    order: 3,
    logo: '/images/logo_part/Русский Фейерверк.webp',
    website: 'https://rusfireworks.ru',
    description:
      'Сеть магазинов сертифицированной пиротехники. Безопасная продукция, скидки до 40% по карте лояльности.',
  },
  {
    name: 'Angiopharm',
    category: 'service',
    color: 'purple',
    floor: 1,
    order: 4,
    logo: '/images/logo_part/Angiopharm.png',
    website: 'https://angiopharm.com',
    description:
      'Производитель профессиональной уходовой косметики. Разработка препаратов на основе рекомбинантного ангиогенина. Производство в наукограде Кольцово, Новосибирск.',
  },
  {
    name: 'НРК-Р.О.С.Т.',
    category: 'service',
    color: 'indigo',
    floor: 1,
    order: 5,
    logo: '/images/logo_part/НРК-Р.О.С.Т..png',
    website: 'https://rrost.ru',
    description:
      'Лидер регистраторской отрасли России. Ведение реестров акционеров, специализированный депозитарий, корпоративный консалтинг.',
  },
  {
    name: 'ИНПЭС',
    category: 'service',
    color: 'teal',
    floor: 1,
    order: 6,
    logo: '/images/logo_part/ИНПЭС.png',
    website: 'https://inpes.ru',
    description:
      'Проектная компания по комплексному проектированию объектов электросетевой инфраструктуры. Опыт реализации проектов в 40 регионах России.',
  },
  {
    name: 'Имплант Сибири',
    category: 'service',
    color: 'orange',
    floor: 1,
    order: 7,
    logo: '/images/logo_part/Имплант Сибири.png',
    website: 'https://implantsibir.ru',
    description:
      'Стоматологическая клиника с более чем 20-летним опытом. Имплантация, протезирование, пародонтология. Безболезненное лечение с применением передовых технологий.',
  },
]

async function main() {
  console.log('Заполняю таблицу BuildingOrg...')

  for (const org of ORGS) {
    const existing = await prisma.buildingOrg.findFirst({ where: { name: org.name } })
    if (existing) {
      await prisma.buildingOrg.update({ where: { id: existing.id }, data: org })
      console.log(`  ✔ Обновлено: ${org.name}`)
    } else {
      await prisma.buildingOrg.create({ data: { ...org, active: true } })
      console.log(`  ✔ Добавлено: ${org.name}`)
    }
  }

  console.log('Готово!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
