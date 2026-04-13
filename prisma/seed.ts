import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Hero slides
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'Современные офисы в центре города',
        subtitle: 'Гибкие условия аренды от 20 м²',
        buttonText: 'Смотреть офисы',
        buttonUrl: '/offices',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
        order: 0,
        active: true,
      },
      {
        title: 'Готовые рабочие места',
        subtitle: 'Интернет, мебель, охрана — всё включено',
        buttonText: 'Оставить заявку',
        buttonUrl: '/contacts',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920',
        order: 1,
        active: true,
      },
      {
        title: 'Дополнительные услуги',
        subtitle: 'Переговорные комнаты, реклама, юридический адрес',
        buttonText: 'Узнать подробнее',
        buttonUrl: '/services',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920',
        order: 2,
        active: true,
      },
    ],
  })

  // Advantages
  await prisma.advantage.createMany({
    data: [
      {
        icon: 'location',
        title: 'Удобное расположение',
        text: 'В центре города, рядом с метро и остановками общественного транспорта',
        order: 0,
      },
      {
        icon: 'security',
        title: 'Безопасность 24/7',
        text: 'Круглосуточная охрана, видеонаблюдение, контроль доступа',
        order: 1,
      },
      {
        icon: 'wifi',
        title: 'Высокоскоростной интернет',
        text: 'Оптоволоконный интернет до 1 Гбит/с, резервный канал',
        order: 2,
      },
      {
        icon: 'parking',
        title: 'Парковка',
        text: 'Собственная охраняемая парковка на 200 мест',
        order: 3,
      },
      {
        icon: 'cafe',
        title: 'Инфраструктура',
        text: 'Кафе, банкомат, переговорные комнаты, зоны отдыха',
        order: 4,
      },
      {
        icon: 'flexible',
        title: 'Гибкие условия',
        text: 'Аренда от 1 месяца, возможность расширения площади',
        order: 5,
      },
      {
        icon: 'clean',
        title: 'Обслуживание',
        text: 'Ежедневная уборка, техническое обслуживание помещений',
        order: 6,
      },
      {
        icon: 'support',
        title: 'Поддержка',
        text: 'Персональный менеджер, помощь в организации переезда',
        order: 7,
      },
    ],
  })

  // Tenants
  await prisma.tenant.createMany({
    data: [
      {
        name: 'Сбер',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sber-logo.svg/200px-Sber-logo.svg.png',
        order: 0,
      },
      {
        name: 'VK',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/VK_logo.svg/200px-VK_logo.svg.png',
        order: 1,
      },
      {
        name: 'Яндекс',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/200px-Yandex_icon.svg.png',
        order: 2,
      },
      {
        name: 'МТС',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/MTS_logo_2022.svg/200px-MTS_logo_2022.svg.png',
        order: 3,
      },
    ],
  })

  // Services
  const advertising = await prisma.service.create({
    data: {
      slug: 'reklama',
      title: 'Реклама на территории БЦ',
      content:
        '<p>Размещение рекламных материалов на территории бизнес-центра с высоким трафиком.</p>',
      priceText: 'от 15 000 ₽/мес',
      order: 0,
      seoTitle: 'Реклама в бизнес-центре',
      seoDesc: 'Размещение рекламы на территории бизнес-центра',
      options: {
        create: [
          {
            label: 'Баннер в холле',
            description: 'Формат 2×3 м, подсветка',
            price: '15 000 ₽/мес',
            order: 0,
          },
          {
            label: 'Реклама на мониторах',
            description: '15-секундный ролик, 4 монитора',
            price: '8 000 ₽/мес',
            order: 1,
          },
          {
            label: 'Стойка с материалами',
            description: 'Место для буклетов и листовок в холле',
            price: '3 000 ₽/мес',
            order: 2,
          },
        ],
      },
    },
  })

  await prisma.service.createMany({
    data: [
      {
        slug: 'peregovornye',
        title: 'Переговорные комнаты',
        content: '<p>Современные переговорные комнаты с оборудованием для презентаций.</p>',
        priceText: 'от 500 ₽/час',
        order: 1,
      },
      {
        slug: 'yuradres',
        title: 'Юридический адрес',
        content: '<p>Предоставление юридического адреса для регистрации компании.</p>',
        priceText: '5 000 ₽/мес',
        order: 2,
      },
    ],
  })

  // Site settings (flat keys matching SettingsPage)
  await prisma.siteSettings.createMany({
    data: [
      { key: 'phone1', value: '+7 (383) 223-43-50' },
      { key: 'phone2', value: '+7 (383) 217-80-07' },
      { key: 'email', value: 'kommunist35@mail.ru' },
      { key: 'address', value: '630007, г. Новосибирск, ул. Коммунистическая, 35' },
      { key: 'workHours', value: 'Ежедневно: 08:00–20:00' },
      { key: 'workHoursAdmin', value: 'Пн–Пт: 08:00–16:30' },
      { key: 'socialVk', value: '' },
      { key: 'socialTg', value: '' },
      { key: 'socialWa', value: '' },
      { key: 'socialAvito', value: '' },
      { key: 'mapProvider', value: 'yandex' },
      { key: 'mapLat', value: '54.9965' },
      { key: 'mapLng', value: '82.9167' },
      { key: 'mapZoom', value: '16' },
    ],
  })

  // Admin user — создаётся из ADMIN_EMAIL + ADMIN_PASSWORD в .env
  // Building orgs — арендаторы бизнес-центра
  await prisma.buildingOrg.createMany({
    data: [
      {
        name: 'ТКБ Банк',
        category: 'bank',
        description:
          'ТКБ Банк — российский банк с более чем 30-летней историей, входящий в топ-10 частных банков по активам. Широкий спектр услуг для частных лиц и бизнеса.',
        website: 'https://www.tkbbank.ru',
        floor: 2,
        color: 'blue',
        order: 0,
        active: true,
      },
      {
        name: 'СберПраво',
        category: 'service',
        description:
          'Юридический сервис экосистемы Сбера: консультации, подготовка документов, судебное представительство. Банкротство физлиц, семейные и жилищные споры.',
        website: 'https://sberpravo.ru',
        floor: 3,
        color: 'green',
        order: 1,
        active: true,
      },
      {
        name: 'I Dolci',
        category: 'food',
        description:
          'Сеть кафе-кондитерских с натуральными десертами ручной работы: бисквитные и муссовые торты, пирожные, чизкейки. Доставка, мастер-классы, кейтеринг.',
        website: 'https://idolci.ru',
        floor: 1,
        color: 'amber',
        order: 2,
        active: true,
      },
      {
        name: 'Русский Фейерверк',
        category: 'retail',
        description:
          'Сеть магазинов пиротехники, представленная в десятках городов России. Безопасная продукция, система скидок до 40% по карте лояльности.',
        website: 'https://rusfireworks.ru',
        floor: 1,
        color: 'red',
        order: 3,
        active: true,
      },
      {
        name: 'Angiopharm',
        category: 'other',
        description:
          'Лаборатория-производитель профессиональной уходовой косметики. Собственная разработка — рекомбинантный ангиогенин. Производство в наукограде Кольцово.',
        website: 'https://angiopharm.com',
        floor: 4,
        color: 'purple',
        order: 4,
        active: true,
      },
      {
        name: 'НРК-Р.О.С.Т.',
        category: 'service',
        description:
          'Лидер регистраторской отрасли России. Ведение реестров акционеров, специализированный депозитарий, корпоративный консалтинг, цифровые сервисы для эмитентов.',
        website: 'https://rrost.ru',
        floor: 5,
        color: 'indigo',
        order: 5,
        active: true,
      },
      {
        name: 'ИНПЭС',
        category: 'other',
        description:
          'Проектная компания, специализирующаяся на комплексном проектировании объектов электросетевой инфраструктуры. Опыт в 40 регионах России.',
        website: 'https://inpes.ru',
        floor: 6,
        color: 'teal',
        order: 6,
        active: true,
      },
      {
        name: 'Имплант Сибири',
        category: 'other',
        description:
          'Стоматологическая клиника с более чем 20-летним опытом. Имплантация, протезирование, пародонтология. Безболезненное лечение с использованием передовых технологий.',
        website: 'https://implantsibir.ru',
        floor: 2,
        color: 'orange',
        order: 7,
        active: true,
      },
    ],
  })

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash },
    })
    console.log(`Admin created: ${adminEmail}`)
  } else {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — admin user skipped')
  }

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
