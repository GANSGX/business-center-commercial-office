import { PrismaClient, RoomStatus } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

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

  // Rooms
  const roomsData = [
    {
      slug: 'ofis-101',
      title: 'Офис 101',
      roomNumber: '101',
      area: 35,
      floor: 1,
      priceMonth: 52500,
      priceM2: 1500,
      status: RoomStatus.FREE,
      showOnHome: true,
      windows: true,
      internet: 'Оптоволокно 1 Гбит/с',
    },
    {
      slug: 'ofis-201',
      title: 'Офис 201',
      roomNumber: '201',
      area: 55,
      floor: 2,
      priceMonth: 77000,
      priceM2: 1400,
      status: RoomStatus.FREE,
      showOnHome: true,
      water: true,
      wc: true,
      windows: true,
    },
    {
      slug: 'ofis-205',
      title: 'Офис 205',
      roomNumber: '205',
      area: 80,
      floor: 2,
      priceMonth: 104000,
      priceM2: 1300,
      status: RoomStatus.RESERVED,
      showOnHome: true,
    },
    {
      slug: 'ofis-301',
      title: 'Офис 301',
      roomNumber: '301',
      area: 120,
      floor: 3,
      priceMonth: 144000,
      priceM2: 1200,
      status: RoomStatus.FREE,
      showOnHome: true,
      water: true,
      wc: true,
    },
    {
      slug: 'ofis-302',
      title: 'Офис 302',
      roomNumber: '302',
      area: 45,
      floor: 3,
      priceMonth: 63000,
      priceM2: 1400,
      status: RoomStatus.RENTED,
      showOnHome: false,
    },
    {
      slug: 'ofis-401',
      title: 'Офис 401',
      roomNumber: '401',
      area: 200,
      floor: 4,
      priceMonth: 220000,
      priceM2: 1100,
      status: RoomStatus.FREE,
      showOnHome: true,
      water: true,
      wc: true,
      windows: true,
    },
  ]

  for (const room of roomsData) {
    await prisma.room.create({ data: room })
  }

  // Gallery
  await prisma.galleryImage.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        caption: 'Холл бизнес-центра',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        caption: 'Офисное пространство',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        caption: 'Вид снаружи',
        order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
        caption: 'Переговорная комната',
        order: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
        caption: 'Зона отдыха',
        order: 4,
      },
      {
        url: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800',
        caption: 'Рабочие места',
        order: 5,
      },
      {
        url: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800',
        caption: 'Парковка',
        order: 6,
      },
      {
        url: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800',
        caption: 'Кафе',
        order: 7,
      },
      {
        url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',
        caption: 'Лифтовый холл',
        order: 8,
      },
      {
        url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800',
        caption: 'Панорамные окна',
        order: 9,
      },
    ],
  })

  // Site settings
  await prisma.siteSettings.createMany({
    data: [
      { key: 'phones', value: JSON.stringify(['+7 (495) 123-45-67', '+7 (495) 765-43-21']) },
      { key: 'email', value: 'info@businesscenter.ru' },
      { key: 'address', value: 'г. Москва, ул. Примерная, д. 1' },
      { key: 'workHours', value: 'Пн–Пт: 9:00–18:00' },
      {
        key: 'socials',
        value: JSON.stringify({ vk: 'https://vk.com/', telegram: 'https://t.me/' }),
      },
      { key: 'mapProvider', value: 'yandex' },
      { key: 'mapLat', value: '55.751244' },
      { key: 'mapLng', value: '37.618423' },
      { key: 'mapZoom', value: '15' },
    ],
  })

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
