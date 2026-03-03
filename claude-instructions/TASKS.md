# TASKS.md — Канбан задач

> Формат для GitHub Projects / ручного ведения.
> Claude Code может создавать Issues из этого файла командой: `gh issue create`
> Статусы: `[ ]` = Todo, `[~]` = In Progress, `[x]` = Done, `[!]` = Blocked

---

## Спринт 0 — Инфраструктура и фундамент

### Dev 1

- [ ] **[S0-D1-01]** Инициализация проекта: `npx create-next-app@latest` с флагами `--typescript --app --src-dir --import-alias "@/*"`. Добавить ESLint, Prettier, Husky, lint-staged.
  - `npm install -D prettier eslint-config-prettier husky lint-staged`
  - Конфиг `.prettierrc`, `.eslintrc.json` (strict, no-unused-vars, no-explicit-any)
  - Husky pre-commit: `eslint --fix && prettier --write && tsc --noEmit`

- [ ] **[S0-D1-02]** Создать FSD структуру директорий: все папки `src/app/(public)`, `src/app/(admin)`, `src/pages`, `src/widgets/*`, `src/features/*`, `src/entities/*`, `src/shared/*` с `.gitkeep`

- [ ] **[S0-D1-03]** Prisma schema: создать `prisma/schema.prisma` со всеми моделями из CLAUDE.md (Room, RoomPhoto, HeroSlide, Advantage, Tenant, Service, ServiceOption, GalleryImage, Lead, SiteSettings, User). Первая миграция.

- [ ] **[S0-D1-04]** NextAuth.js v5: установить и настроить credentials provider. Создать `src/app/api/auth/[...nextauth]/route.ts`. Bcrypt для паролей.

- [ ] **[S0-D1-05]** Middleware (`src/app/middleware.ts`): защита admin-роутов через ADMIN_SLUG + проверку сессии. Возвращает 404 при неверном slug. Добавляет X-Robots-Tag для admin.

- [ ] **[S0-D1-06]** `src/styles/globals.css`: все CSS-переменные из CLAUDE.md. CSS reset (box-sizing, margin: 0). Базовая типографика. Подключить шрифт Inter через `next/font`.

- [ ] **[S0-D1-07]** `shared/ui` атомарные компоненты:
  - `Button` (variants: primary, secondary, outline, ghost; sizes: sm, md, lg)
  - `Input`, `Textarea`, `Checkbox`
  - `Modal` (portal, закрытие по Esc и overlay)
  - `Spinner`
  - `Badge` (статусы: free/reserved/rented + цвета)
  - `Pagination`
  - Каждый с `.module.css` и экспортом через `shared/ui/index.ts`

- [ ] **[S0-D1-08]** Seed-скрипт `prisma/seed.ts`: 5-6 тестовых помещений с фото, 3 слайда, 8 преимуществ, 3-4 арендатора, 3 услуги (включая "Реклама" с options), 10 фото галереи, настройки контактов.

- [ ] **[S0-D1-09]** Скрипт `scripts/create-admin.ts`: создаёт User с bcrypt-хешем пароля из ENV.

---

### Dev 2

- [ ] **[S0-D2-01]** `Dockerfile` (multi-stage): Stage 1 `deps` (npm ci), Stage 2 `builder` (npm run build), Stage 3 `runner` (копирует `.next`, NODE_ENV=production, порт 3000).

- [ ] **[S0-D2-02]** `docker-compose.yml` с профилями `dev` и `prod`:
  - `app`: build из Dockerfile, env_file: .env
  - `postgres:16-alpine`: volume pgdata, healthcheck pg_isready, только internal network
  - `nginx:1.25-alpine`: порты 80/443, зависит от app
  - Профиль `dev`: volume mount `./src:/app/src` для hot reload, postgres expose :5432
  - Профиль `prod`: no exposed ports кроме nginx, restart: unless-stopped

- [ ] **[S0-D2-03]** `docker/nginx.conf`: HTTP:80 → redirect HTTPS:443. HTTPS → proxy_pass http://app:3000. Gzip on. Статика cache 1 год. SSL из `/etc/nginx/certs/`.

- [ ] **[S0-D2-04]** `.env.example` с комментариями для всех переменных (DATABASE*URL, NEXTAUTH*_, ADMIN*SLUG, EMAIL*_, UPLOADTHING_SECRET, NEXT_PUBLIC_MAP_PROVIDER).

- [ ] **[S0-D2-05]** GitHub Actions `.github/workflows/ci.yml`: триггер на push в любую ветку. Jobs: `lint` (eslint), `typecheck` (tsc --noEmit), `build` (npm run build с DATABASE_URL=mock).

- [ ] **[S0-D2-06]** `README.md` с инструкцией деплоя для хостинговой стороны (8 шагов из плана разработки).

- [ ] **[S0-D2-07]** `next.config.ts`: security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Настройка `images.domains` для Uploadthing/S3. `trailingSlash: false`.

---

## Спринт 1 — Публичная часть: Главная + Каталог офисов

### Dev 1

- [ ] **[S1-D1-01]** `entities/room`: типы `Room`, `RoomCard`, `RoomStatus`. Функции `getRooms(filters)`, `getRoomBySlug(slug)`. Маппер Prisma → DTO.

- [ ] **[S1-D1-02]** `widgets/hero-slider`: Swiper.js слайдер. Пропсы: `slides: HeroSlide[]`. Автоплей, стрелки, точки. Первое изображение `priority`. CSS Modules. Тёмный оверлей над фото.

- [ ] **[S1-D1-03]** `widgets/room-card`: карточка помещения. Пропсы: `room: RoomCard`. Фото (next/image lazy), площадь, этаж, цена/мес, Badge статуса, CTA-кнопка по статусу (FREE→"Оставить заявку", RESERVED→"Раннее бронирование", RENTED→"Уточнить наличие").

- [ ] **[S1-D1-04]** `widgets/advantages`: секция "Почему выбирают нас". Сетка 4/2/1. SVG-иконки как компоненты (`shared/ui/icons/`). Пропсы: `items: Advantage[]`.

- [ ] **[S1-D1-05]** `widgets/tenants`: логотипы арендаторов. Горизонтальная прокрутка на мобильных. next/image с `object-contain`. Пропсы: `items: Tenant[]`.

- [ ] **[S1-D1-06]** `widgets/map`: компонент карты. **Ленивая загрузка через IntersectionObserver** — JS карты не грузится до появления в viewport. Провайдер (yandex/2gis) из `NEXT_PUBLIC_MAP_PROVIDER`. Координаты через пропсы.

- [ ] **[S1-D1-07]** `pages/home`: сборка главной страницы. Порядок секций: HeroSlider → АктуальныеПредложения → Advantages → Tenants → LeadForm → Map. Данные через ISR (revalidate: 300).

- [ ] **[S1-D1-08]** `src/app/(public)/page.tsx`: `generateMetadata` (title, description, OG), JSON-LD Organization + LocalBusiness. Подключает `pages/home`.

- [ ] **[S1-D1-09]** `widgets/header`: логотип + навигация. Dropdown для "Дополнительные услуги" (список из пропсов). Sticky при скролле (добавляет класс с bg и shadow). Бургер-меню → drawer на мобильных. Пункты: Аренда офисов, Доп. услуги, Фотогалерея, Расположение, О нас, Контакты.

- [ ] **[S1-D1-10]** `widgets/footer`: контакты, ссылки на разделы, соцсети, копирайт, ссылка на политику ПДн.

- [ ] **[S1-D1-11]** `widgets/floating-cta`: fixed кнопка "Напишите нам". На мобильных — круглый FAB. Клик → открывает Modal с LeadForm. Присутствует в `app/(public)/layout.tsx`.

---

### Dev 2

- [ ] **[S1-D2-01]** `src/app/api/rooms/route.ts`: GET с фильтрами (status, areaMin, areaMax, floor, priceMin, priceMax, showOnHome), сортировкой (price/area/floor asc/desc), пагинацией (page, limit). Zod-валидация query params. Cache-Control: max-age=30.

- [ ] **[S1-D2-02]** `src/app/api/rooms/[slug]/route.ts`: GET одного помещения с photos[]. 404 если не найдено.

- [ ] **[S1-D2-03]** `src/app/api/hero-slides/route.ts`, `advantages/route.ts`, `tenants/route.ts`: GET endpoints с сортировкой по order.

- [ ] **[S1-D2-04]** `features/room-filter`: UI компонент фильтров. Поля: статус (radio/tabs), площадь от/до, этаж (select), цена от/до, сортировка. Zustand store `useRoomFilterStore` в `features/room-filter/model/`. Синхронизация с URL через `useSearchParams` + `useRouter`.

- [ ] **[S1-D2-05]** `pages/offices`: каталог. Использует `room-filter` + сетку `RoomCard`. Skeleton loader (CSS-анимация) пока данные грузятся. Пагинация внизу. `generateMetadata`.

- [ ] **[S1-D2-06]** `src/app/(public)/offices/page.tsx`: SSR с `searchParams` для фильтров. Передаёт данные в `pages/offices`.

- [ ] **[S1-D2-07]** JSON-LD `BreadcrumbList` компонент в `shared/lib/jsonld.ts`. JSON-LD Organization + LocalBusiness утилиты.

- [ ] **[S1-D2-08]** `shared/hooks/useIntersection.ts`: хук IntersectionObserver для ленивой загрузки компонентов.

- [ ] **[S1-D2-09]** `shared/hooks/useDebounce.ts`: дебаунс для полей фильтра площадь/цена.

---

## Спринт 2 — Карточка помещения + Формы + Услуги + Остальные страницы

### Dev 1

- [ ] **[S2-D1-01]** `src/app/(public)/offices/[slug]/page.tsx`: ISR revalidate: 60. `generateMetadata` с title/desc/OG. JSON-LD Product + BreadcrumbList.

- [ ] **[S2-D1-02]** Галерея на карточке помещения: главное фото крупно + миниатюры Swiper. Клик на миниатюру → меняет главное. Клик на главное → `features/gallery-lightbox`.

- [ ] **[S2-D1-03]** `features/gallery-lightbox`: dynamic import. Просмотр полноразмерного фото, навигация стрелками, закрытие по Esc и клику вне.

- [ ] **[S2-D1-04]** Таблица характеристик помещения: рендерить **только заполненные поля**. Поля: Номер, Тип, Площадь, Этаж, Планировка, Вода, Санузел, Окна, Вход, Тип аренды, Интернет, Мин. срок аренды.

- [ ] **[S2-D1-05]** Блок "Подходит для": рендер `suitableFor[]` как список тегов.

- [ ] **[S2-D1-06]** `features/lead-submit` + `widgets/lead-form`: форма заявки. React Hook Form + Zod. Поля: name, phone (маска), email, message. Чекбокс ПДн. Honeypot `website`. Оптимистичный UI. Открывается с предзаполненным roomId или serviceName.

- [ ] **[S2-D1-07]** `src/app/(public)/gallery/page.tsx`: сетка 3-4 в ряд, next/image lazy + blur, lightbox. ISR 600. `generateMetadata`.

- [ ] **[S2-D1-08]** `src/app/(public)/contacts/page.tsx`: блок данных (адрес, телефоны click-to-call, email mailto, часы работы), соцсети, реквизиты, LeadForm, Map. ISR 600. `generateMetadata`.

- [ ] **[S2-D1-09]** `src/app/not-found.tsx`: кастомная 404. Ссылки на главные разделы. Без лишнего.

---

### Dev 2

- [ ] **[S2-D2-01]** `src/app/api/rooms/[slug]/route.ts`: убедиться что возвращает 404 при отсутствии. Добавить include photos sorted by order.

- [ ] **[S2-D2-02]** `src/app/api/leads/route.ts` POST: Zod-валидация тела. Honeypot check (если `website` заполнено → return 200, не сохранять). Rate limit: 5 req/15min per IP (in-memory Map с TTL). Сохранить в БД. Отправить email через Nodemailer.

- [ ] **[S2-D2-03]** `entities/service`: типы `Service`, `ServiceOption`. Функции `getServices()`, `getServiceBySlug(slug)`.

- [ ] **[S2-D2-04]** `src/app/api/services/route.ts` и `services/[slug]/route.ts`: GET endpoints с options[].

- [ ] **[S2-D2-05]** `src/app/(public)/services/page.tsx`: список услуг. Карточки с иконкой/изображением, названием, кратким описанием, кнопкой "Подробнее". ISR 60.

- [ ] **[S2-D2-06]** `src/app/(public)/services/[slug]/page.tsx`: карточка услуги. Заголовок, изображение, richtext описание (санитизация!), priceText ИЛИ таблица options[]. Для каждого option: label, description, price. CTA "Оставить заявку". ISR 60. `generateMetadata`.

- [ ] **[S2-D2-07]** `src/app/api/settings/route.ts` GET: возвращает все SiteSettings как `{[key]: value}`.

- [ ] **[S2-D2-08]** `entities/site-settings`: тип `SiteSettingsMap`. Функция `getSettings()`.

---

## Спринт 3 — Административная панель

### Dev 1

- [ ] **[S3-D1-01]** `src/app/(admin)/[adminSlug]/layout.tsx`: admin layout. Sidebar навигация (Dashboard, Помещения, Главная страница, Услуги, Галерея, Заявки, Настройки). Auth guard: если нет сессии → redirect на login. Все компоненты через dynamic import.

- [ ] **[S3-D1-02]** `src/app/(admin)/[adminSlug]/page.tsx`: Dashboard. Счётчики: всего помещений, свободных, новых заявок за сегодня. Последние 5 заявок.

- [ ] **[S3-D1-03]** `src/app/(admin)/[adminSlug]/rooms/page.tsx`: таблица помещений. Колонки: номер, название, площадь, этаж, статус (select inline), showOnHome (toggle inline), действия (ред./удал.). Кнопка "Добавить".

- [ ] **[S3-D1-04]** `src/app/(admin)/[adminSlug]/rooms/[id]/page.tsx`: форма редактирования/создания помещения. Все поля из модели Room. Описание — Tiptap (dynamic import). suitableFor — tag input.

- [ ] **[S3-D1-05]** Загрузка фото помещения: drag & drop upload (HTML5 + fetch к `/api/upload`). Preview. Drag & drop сортировка через dnd-kit. Удаление отдельных фото.

- [ ] **[S3-D1-06]** `src/app/(admin)/[adminSlug]/hero-slides/page.tsx`: таблица + форма. Поля: title, subtitle, buttonText, buttonUrl, image upload, active toggle. dnd-kit сортировка.

- [ ] **[S3-D1-07]** `src/app/(admin)/[adminSlug]/hero-slides/` — Advantages (иконка из набора + title + text) и Tenants (logo upload + name). Оба с dnd-kit сортировкой.

- [ ] **[S3-D1-08]** `src/app/(admin)/[adminSlug]/services/page.tsx`: список услуг + drag & drop сортировка.

- [ ] **[S3-D1-09]** `src/app/(admin)/[adminSlug]/services/[id]/page.tsx`: форма услуги. title, slug (авто из title через translit), Tiptap, image, priceText, SEO поля. Блок Options: add/remove/reorder (dnd-kit).

---

### Dev 2

- [ ] **[S3-D2-01]** Все Admin API Routes — POST/PUT/DELETE для rooms, services, hero-slides, advantages, tenants, gallery. Каждый проверяет сессию NextAuth. Zod-валидация тела.

- [ ] **[S3-D2-02]** `src/app/api/upload/route.ts`: загрузка файла. Uploadthing или S3. Возвращает `{url: string}`. Проверка типа файла (только image/\*). Ограничение размера 10MB.

- [ ] **[S3-D2-03]** `src/app/api/rooms/[id]/photos/route.ts`: POST (загрузить фото к помещению), DELETE (удалить), PATCH order (принимает `{ids: string[]}`, обновляет order батчом).

- [ ] **[S3-D2-04]** `src/app/(admin)/[adminSlug]/gallery/page.tsx`: сетка всех фото. Массовый upload. caption-поле. dnd-kit сортировка. Удаление.

- [ ] **[S3-D2-05]** `src/app/(admin)/[adminSlug]/leads/page.tsx`: таблица заявок. Колонки: дата, имя, телефон, email, сообщение, помещение/услуга, статус. Фильтр по статусу. Поиск по имени/телефону. Кнопка смены статуса. Новые — жирный шрифт. Пагинация.

- [ ] **[S3-D2-06]** `src/app/api/leads/route.ts` GET + `leads/[id]/route.ts` PATCH: список с фильтром/поиском/пагинацией. Смена статуса.

- [ ] **[S3-D2-07]** `src/app/(admin)/[adminSlug]/settings/page.tsx`: форма настроек. Телефоны (dynamic list). Email, адрес, часы работы. Соцсети (VK, WhatsApp, Telegram, Avito). Реквизиты (textarea). Карта (провайдер select, lat, lng, zoom). Кнопка Сохранить с optimistic update.

- [ ] **[S3-D2-08]** `src/app/api/settings/route.ts` PATCH: сохраняет массив `{key, value}[]` батчом через `prisma.siteSettings.upsert`.

---

## Спринт 4 — SEO, оптимизация, деплой, QA

### Dev 1

- [ ] **[S4-D1-01]** `next-sitemap.config.js`: статические страницы + динамические `/offices/[slug]` + `/services/[slug]`. Исключить admin-путь. Запустить `next-sitemap` как post-build шаг.

- [ ] **[S4-D1-02]** `public/robots.txt`: Allow публичные страницы, Disallow `/api/`, `/[ADMIN_SLUG]/`. Ссылка на sitemap.

- [ ] **[S4-D1-03]** Lighthouse audit на всех страницах. Цели: Performance ≥ 85, SEO ≥ 95, Accessibility ≥ 85, Best Practices ≥ 90 на мобильном.

- [ ] **[S4-D1-04]** Проверка адаптива: iPhone SE (375px), iPhone 14 (390px), iPad (768px), 1280px, 1440px. Исправить все визуальные баги.

- [ ] **[S4-D1-05]** Кроссбраузерное тестирование: Chrome, Firefox, Safari, Edge, мобильный Safari.

- [ ] **[S4-D1-06]** Финальная проверка чеклиста из CLAUDE.md. Закрыть все открытые TODO в коде.

---

### Dev 2

- [ ] **[S4-D2-01]** OG-images: `src/app/opengraph-image.tsx` для главной. Dynamic OG для `/offices/[slug]` через `next/og` — фото помещения + название + площадь + цена.

- [ ] **[S4-D2-02]** Bundle analyzer: установить `@next/bundle-analyzer`. Найти и исправить тяжёлые зависимости (Swiper, Tiptap → dynamic import с loading state).

- [ ] **[S4-D2-03]** Production docker-compose финал: healthcheck у app (wget /api/health), multi-stage build проверен, все volumes.

- [ ] **[S4-D2-04]** `src/app/api/health/route.ts`: простой healthcheck endpoint → `{status: "ok"}`.

- [ ] **[S4-D2-05]** Nginx prod конфиг финал: HTTP→HTTPS, Brotli/gzip, cache headers, proxy timeouts.

- [ ] **[S4-D2-06]** Проверка безопасности: заголовки безопасности в браузере, CSP не блокирует карту, ADMIN_SLUG не виден в HTML/JS/networks, rate limit работает.

---

## Backlog (на будущее / по запросу клиента)

- [ ] Страница "О нас" `/about`
- [ ] Политика конфиденциальности `/privacy`
- [ ] Мультиязычность (ru/en)
- [ ] Интеграция с CRM (AmoCRM, Битрикс24)
- [ ] Email-шаблоны HTML для уведомлений о заявках
- [ ] Telegram-уведомления о новых заявках
- [ ] Экспорт заявок в CSV из админки
- [ ] Аналитика: Яндекс.Метрика / GA4 (через Script next/third-parties)
