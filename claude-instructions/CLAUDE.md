# CLAUDE.md — Контекст проекта для Claude Code

> Этот файл читается Claude Code автоматически при каждой сессии.
> Содержит всё необходимое для работы без дополнительных объяснений.

---

## Проект

**Тип:** Сайт бизнес-центра — аренда офисов и дополнительные услуги.
**Задача:** Публичный сайт с каталогом помещений + скрытая CMS-админка.
**Статус:** В разработке. Ветки: `main` (prod), `develop` (staging), `feature/dev1-*`, `feature/dev2-*`.

---

## Стек — строго соблюдать

| Слой        | Технология                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Next.js 15, App Router, React 19                                                                                                 |
| Язык        | TypeScript 5, `strict: true`                                                                                                     |
| Стили       | **CSS Modules** (`.module.css`) + CSS Custom Properties. **Tailwind запрещён. UI-библиотеки с готовыми компонентами запрещены.** |
| Стейт       | Zustand (только для глобального: фильтры, UI-флаги)                                                                              |
| Формы       | React Hook Form + Zod                                                                                                            |
| БД          | PostgreSQL 16 + Prisma ORM                                                                                                       |
| Auth        | NextAuth.js v5, credentials provider                                                                                             |
| Слайдеры    | Swiper.js (импорт как модуль)                                                                                                    |
| Drag & drop | dnd-kit (только в админке)                                                                                                       |
| Richtext    | Tiptap (только в админке, dynamic import)                                                                                        |
| Email       | Nodemailer                                                                                                                       |
| Изображения | next/image везде. Хранилище — Uploadthing или S3-совместимое                                                                     |
| Инфра       | Docker + docker-compose + Nginx                                                                                                  |

---

## Архитектура — FSD (Feature-Sliced Design)

**Обязательно изучить:** https://feature-sliced.design

### Слои (импорты только ВНИЗ):

```
app → pages → widgets → features → entities → shared
```

### Структура:

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/               # Публичные страницы
│   │   ├── page.tsx            # Главная /
│   │   ├── offices/
│   │   │   ├── page.tsx        # Каталог /offices
│   │   │   └── [slug]/page.tsx # Карточка /offices/[slug]
│   │   ├── services/
│   │   │   ├── page.tsx        # Список /services
│   │   │   └── [slug]/page.tsx # Услуга /services/[slug]
│   │   ├── gallery/page.tsx    # /gallery
│   │   └── contacts/page.tsx   # /contacts
│   ├── (admin)/
│   │   └── [adminSlug]/        # Значение из process.env.ADMIN_SLUG (не хардкодить!)
│   │       ├── layout.tsx      # Admin layout + auth guard
│   │       ├── page.tsx        # Dashboard
│   │       ├── rooms/
│   │       ├── services/
│   │       ├── leads/
│   │       ├── gallery/
│   │       ├── hero-slides/
│   │       └── settings/
│   ├── api/                    # Route Handlers
│   │   ├── rooms/
│   │   ├── services/
│   │   ├── leads/
│   │   ├── gallery/
│   │   ├── upload/
│   │   ├── settings/
│   │   └── auth/
│   ├── layout.tsx              # Root layout
│   ├── not-found.tsx           # Кастомная 404
│   └── middleware.ts           # Auth guard + noindex для admin
├── pages/                      # Page-компоненты (только компоновка виджетов)
├── widgets/                    # Самодостаточные блоки
│   ├── header/
│   ├── footer/
│   ├── hero-slider/
│   ├── room-card/
│   ├── advantages/
│   ├── tenants/
│   ├── lead-form/
│   ├── map/
│   ├── gallery-grid/
│   └── floating-cta/
├── features/                   # Пользовательские действия
│   ├── room-filter/
│   ├── lead-submit/
│   ├── auth-admin/
│   ├── gallery-lightbox/
│   └── image-upload/
├── entities/                   # Бизнес-сущности
│   ├── room/
│   ├── service/
│   ├── lead/
│   ├── gallery/
│   ├── site-settings/
│   ├── hero-slide/
│   ├── advantage/
│   └── tenant/
└── shared/                     # Атомарные переиспользуемые вещи
    ├── ui/                     # Button, Input, Modal, Spinner, Badge, Pagination
    ├── hooks/                  # useDebounce, useIntersection, useMediaQuery
    ├── lib/                    # Утилиты
    ├── config/                 # Константы
    ├── types/                  # Общие типы
    └── api/                    # fetch-обёртка
```

### Структура каждого слайса:

```
widgets/hero-slider/
├── index.ts          # Публичный API: export { HeroSlider }
├── ui/
│   └── HeroSlider.tsx
│   └── HeroSlider.module.css
├── model/            # Хуки, если нужны
└── types.ts
```

### Правила FSD — нарушать нельзя:

- Компонент = JSX + пропсы/хуки. **Никакого fetch/бизнес-логики внутри JSX**
- Логика — в `model/` (хуки) или `api/` (запросы)
- `shared/ui` — только "глупые" атомарные компоненты, **без зависимостей от entities+**
- Каждый слайс экспортирует через `index.ts`

---

## Стили — CSS Modules

### globals.css — CSS переменные (единственный источник темы):

```css
:root {
  /* Цвета */
  --color-bg: #ffffff;
  --color-bg-secondary: #f7f8fa;
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-border: #e5e7eb;
  --color-border-subtle: #f3f4f6;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-text-inverse: #ffffff;

  --color-accent: #1b4fd8; /* Основной акцент — насыщенный синий */
  --color-accent-hover: #1640b0;
  --color-accent-light: #eef2ff;

  --color-hero-bg: #0a1628; /* Тёмный фон для hero-секций */
  --color-hero-surface: #111e35;

  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #d97706;

  --color-status-free: #16a34a;
  --color-status-reserved: #d97706;
  --color-status-rented: #6b7280;

  /* Типографика */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  /* Отступы */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  --spacing-4xl: 6rem;

  /* Контейнер */
  --container-max: 1280px;
  --container-padding: 1.5rem;

  /* Радиусы */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;

  /* Тени */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);

  /* Переходы */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Правила CSS:

- Каждый компонент имеет свой `.module.css` рядом
- Именование классов: camelCase внутри модуля (`styles.cardWrapper`, `styles.priceTag`)
- Медиазапросы внутри `.module.css` — mobile-first (`@media (min-width: 768px)`)
- Анимации — только CSS `transition` / `@keyframes`. JS-анимации для layout-свойств запрещены
- `will-change` — только точечно, не глобально

### Брейкпоинты:

```css
/* mobile: < 480px (базовые стили) */
@media (min-width: 480px) {
  /* tablet-sm */
}
@media (min-width: 768px) {
  /* tablet */
}
@media (min-width: 1024px) {
  /* desktop-sm */
}
@media (min-width: 1280px) {
  /* desktop */
}
@media (min-width: 1440px) {
  /* wide */
}
```

---

## Дизайн-система

**Концепция:** Светлая основа + тёмные hero/accent секции. Премиальный минимализм для коммерческой недвижимости. Референс по духу: Regus, IWG, крупные российские БЦ.

### Принципы:

- Много воздуха (generous whitespace)
- Чёткая типографическая иерархия
- Карточки с мягкой тенью, без тяжёлых рамок
- Акцентный цвет — только для CTA и важных элементов
- Фото — всегда в соотношении, через `aspect-ratio`
- Иконки — SVG-компоненты, не font-icons
- Hero-секции — тёмный фон (`--color-hero-bg`) с белым текстом

### Компоненты shared/ui (атомарные):

**Button:**

```tsx
<Button variant="primary" | "secondary" | "ghost" | "outline" size="sm" | "md" | "lg">
```

- primary: `--color-accent` фон, белый текст, hover darkens
- secondary: `--color-hero-bg` фон, белый текст
- outline: прозрачный фон, `--color-accent` бордер и текст
- ghost: прозрачный, текст accent, hover bg accent-light

**Badge (статус помещения):**

```tsx
<Badge status="free" | "reserved" | "rented" />
```

- free: зелёный фон/текст
- reserved: жёлтый/оранжевый
- rented: серый

**Input, Textarea, Checkbox** — кастомные, стилизованные через CSS Modules.

---

## База данных — Prisma

**Файл:** `prisma/schema.prisma`

```prisma
model Room {
  id           String      @id @default(cuid())
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  slug         String      @unique
  title        String
  roomNumber   String?
  type         String?
  area         Float
  floor        Int
  layoutType   String?
  water        Boolean     @default(false)
  wc           Boolean     @default(false)
  windows      Boolean     @default(false)
  entrance     String?
  rentType     String?
  internet     String?
  minRentTerm  String?
  priceMonth   Int
  priceM2      Float?
  description  String?     // HTML из Tiptap, санитизировать перед рендером
  suitableFor  String[]
  status       RoomStatus  @default(FREE)
  showOnHome   Boolean     @default(false)
  photos       RoomPhoto[]
}

enum RoomStatus { FREE RESERVED RENTED }

model RoomPhoto {
  id     String @id @default(cuid())
  url    String
  order  Int    @default(0)
  room   Room   @relation(fields: [roomId], references: [id], onDelete: Cascade)
  roomId String
}

model HeroSlide {
  id          String  @id @default(cuid())
  title       String
  subtitle    String?
  buttonText  String?
  buttonUrl   String?
  image       String
  order       Int     @default(0)
  active      Boolean @default(true)
}

model Advantage {
  id    String @id @default(cuid())
  icon  String // SVG-name из набора
  title String
  text  String
  order Int    @default(0)
}

model Tenant {
  id    String @id @default(cuid())
  name  String
  logo  String
  order Int    @default(0)
}

model Service {
  id        String          @id @default(cuid())
  slug      String          @unique
  title     String
  content   String?         // HTML richtext
  image     String?
  priceText String?
  order     Int             @default(0)
  seoTitle  String?
  seoDesc   String?
  options   ServiceOption[]
}

model ServiceOption {
  id          String  @id @default(cuid())
  label       String
  description String?
  price       String?
  order       Int     @default(0)
  service     Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  serviceId   String
}

model GalleryImage {
  id      String  @id @default(cuid())
  url     String
  caption String?
  order   Int     @default(0)
}

model Lead {
  id          String     @id @default(cuid())
  createdAt   DateTime   @default(now())
  name        String
  phone       String
  email       String?
  message     String?
  roomId      String?
  serviceName String?
  pageUrl     String?
  utm         Json?
  status      LeadStatus @default(NEW)
}

enum LeadStatus { NEW PROCESSED }

model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
// Ключи: phones | email | address | workHours | socials | requisites
//        mapProvider | mapLat | mapLng | mapZoom

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

---

## API Routes — полный список

Все в `src/app/api/`. Zod-валидация на каждом endpoint обязательна.

### Публичные (GET):

| Путь                       | Описание                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `GET /api/rooms`           | Список. Query: `status`, `areaMin`, `areaMax`, `floor`, `priceMin`, `priceMax`, `sort`, `page`, `limit`, `showOnHome` |
| `GET /api/rooms/[slug]`    | Одно помещение. 404 если нет.                                                                                         |
| `GET /api/hero-slides`     | Активные слайды, order ASC                                                                                            |
| `GET /api/advantages`      | Все, order ASC                                                                                                        |
| `GET /api/tenants`         | Все, order ASC                                                                                                        |
| `GET /api/services`        | Список, order ASC                                                                                                     |
| `GET /api/services/[slug]` | Одна услуга + options[]                                                                                               |
| `GET /api/gallery`         | Все фото, order ASC                                                                                                   |
| `GET /api/settings`        | Все SiteSettings как `{key: value}`                                                                                   |

### Публичный POST:

| Путь              | Описание                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/leads` | Создать заявку. Rate limit: 5 req/15min/IP. Honeypot: поле `website` должно быть пустым. Email-уведомление после сохранения. |

### Admin only (проверка сессии NextAuth обязательна):

| Путь                                      | Описание                                  |
| ----------------------------------------- | ----------------------------------------- |
| `POST/PUT/DELETE /api/rooms`              | CRUD помещений                            |
| `POST /api/rooms/[id]/photos`             | Загрузка фото                             |
| `DELETE /api/rooms/[id]/photos/[photoId]` | Удаление фото                             |
| `PATCH /api/rooms/[id]/photos/order`      | Сортировка фото `{ids: string[]}`         |
| `CRUD /api/hero-slides`                   |                                           |
| `CRUD /api/advantages`                    |                                           |
| `CRUD /api/tenants`                       |                                           |
| `CRUD /api/services`                      |                                           |
| `CRUD /api/services/[id]/options`         |                                           |
| `CRUD /api/gallery`                       |                                           |
| `GET /api/leads`                          | Список. Query: `status`, `search`, `page` |
| `PATCH /api/leads/[id]`                   | Смена статуса                             |
| `PATCH /api/settings`                     | Сохранение настроек                       |
| `POST /api/upload`                        | Загрузка файла → возвращает URL           |

---

## Скрытая админка — правила

1. **ADMIN_SLUG читается ТОЛЬКО через `process.env.ADMIN_SLUG`**. Нигде не хардкодить.
2. **Не использовать `NEXT_PUBLIC_`** — иначе попадёт в браузерный бандл.
3. `middleware.ts` возвращает **404** (не 401, не 403) при неверном slug или отсутствии сессии.
4. Все admin-компоненты — `dynamic(() => import(...), { ssr: false })`.
5. `robots.txt` содержит `Disallow: /[ADMIN_SLUG]/`.
6. В middleware добавлять `X-Robots-Tag: noindex, nofollow` для admin-запросов.

```ts
// middleware.ts — скелет
export function middleware(req: NextRequest) {
  const adminSlug = process.env.ADMIN_SLUG!
  const isAdminPath = req.nextUrl.pathname.startsWith(`/${adminSlug}`)

  if (isAdminPath) {
    // Добавить noindex заголовок
    // Проверить сессию NextAuth → если нет → return NextResponse.rewrite(new URL('/not-found', req.url))
  }
}
```

---

## SEO — обязательно на каждой странице

```ts
// Пример generateMetadata для /offices/[slug]
export async function generateMetadata({ params }): Promise<Metadata> {
  const room = await getRoomBySlug(params.slug)
  return {
    title: `${room.title} — аренда ${room.area} м², этаж ${room.floor}`,
    description: room.description?.replace(/<[^>]*>/g, '').slice(0, 155),
    openGraph: {
      title: ...,
      description: ...,
      images: [{ url: room.photos[0]?.url }],
    },
    alternates: { canonical: `https://domain.com/offices/${params.slug}` },
  }
}
```

### JSON-LD (добавлять через `<script type="application/ld+json">`):

- Главная: `Organization` + `LocalBusiness`
- `/offices/[slug]`: `Product` + `BreadcrumbList`
- `/services/[slug]`: `Service` + `BreadcrumbList`

---

## Производительность — правила

```tsx
// ПРАВИЛЬНО — first image на странице
<Image src={...} alt={...} priority fetchPriority="high" />

// ПРАВИЛЬНО — все остальные
<Image src={...} alt={...} loading="lazy" placeholder="blur" blurDataURL={...} />

// Карта — ленивая загрузка
const MapSection = dynamic(() => import('@/widgets/map'), { ssr: false })
// + IntersectionObserver чтобы не грузить JS карты до скролла

// Lightbox — грузить только при клике
const [lightboxOpen, setLightboxOpen] = useState(false)
const Lightbox = dynamic(() => import('@/features/gallery-lightbox'))
```

### ISR revalidate:

| Страница           | revalidate  |
| ------------------ | ----------- |
| `/`                | 300 (5 мин) |
| `/offices`         | 60          |
| `/offices/[slug]`  | 60          |
| `/services/[slug]` | 60          |
| `/gallery`         | 600         |
| `/contacts`        | 600         |

---

## Формы — LeadForm

Поля: `name` (req), `phone` (req, RU-формат), `email` (опц), `message` (опц, max 1000).
Чекбокс согласия с ПДн — обязателен.
Honeypot: `<input name="website" tabIndex={-1} style={{display:'none'}} />` — если заполнено, API молча игнорирует.

---

## Переменные окружения

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
ADMIN_SLUG=           # Секрет. Только server-side.
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=  # bcrypt hash
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
UPLOADTHING_SECRET=   # или S3_*
NEXT_PUBLIC_MAP_PROVIDER=  # yandex | 2gis (единственный NEXT_PUBLIC_)
```

---

## Git workflow

```
main    ← только релизы (prod)
dev-1   ← ветка разработчика GANSGX
dev-2   ← ветка разработчика xBezumiex
feature/sprint1-room-card     ← feature-ветки создаются от своей dev-*
feature/sprint2-api-rooms
```

**Алгоритм работы:**

1. Взять задачу на Канбан, назначить себя, перевести в In Progress
2. Создать feature-ветку от своей `dev-*`:
   ```bash
   git checkout dev-1
   git pull origin dev-1
   git checkout -b feature/sprint1-название
   ```
3. Сделать работу, коммиты — Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`
4. Запушить, создать PR с `Closes #N` → merge в свою `dev-*`
5. После merge в `dev-*` → синхронизировать в `main` через PR

**Конфликты:** `prisma/schema.prisma`, `globals.css`, `docker-compose.yml` — решать совместно, не трогать без согласования обоих.
**Коммиты:** без подписи Claude. Только содержательные conventional commits.

---

## Команды для работы

```bash
# Разработка
npm run dev

# БД
npx prisma migrate dev --name "название"
npx prisma studio
npx prisma db seed

# Проверка
npm run lint
npm run typecheck    # tsc --noEmit
npm run build

# Docker (локально)
docker compose --profile dev up
docker compose --profile prod up --build

# Создать admin-пользователя
npx ts-node scripts/create-admin.ts
```

---

## Prisma 7 — важные особенности

> Проект использует **Prisma 7**. Конфигурация datasource вынесена в `prisma.config.ts`.

1. **Импорты** — из стандартного `@prisma/client` (generator без кастомного output):

   ```ts
   import { PrismaClient, RoomStatus } from '@prisma/client'
   ```

2. **Singleton** — в коде приложения всегда импортировать готовый клиент:

   ```ts
   import { prisma } from '@/shared/lib/prisma'
   ```

   НЕ создавать новый PrismaClient в каждом файле.

3. **`new PrismaClient()`** — без адаптера, стандартное TCP-соединение через DATABASE_URL:

   ```ts
   // src/shared/lib/prisma.ts
   import { PrismaClient } from '@prisma/client'
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
   export const prisma = globalForPrisma.prisma ?? new PrismaClient()
   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
   ```

4. **prisma.config.ts** — содержит datasource URL. `schema.prisma` также содержит
   `url = env("DATABASE_URL")` для обратной совместимости инструментов (Studio, etc.).

5. **После изменения schema.prisma** всегда запускать:
   ```bash
   npx prisma migrate dev --name "описание"
   npx prisma generate
   ```

---

## Файлы которые нельзя трогать без согласования обоих разработчиков

- `prisma/schema.prisma`
- `src/styles/globals.css`
- `docker-compose.yml`
- `src/middleware.ts`
- `.env.example`
