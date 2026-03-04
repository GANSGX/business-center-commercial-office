# INCONSISTENCIES.md — Несостыковки ТЗ и скелета проекта

> Файл создан после анализа: dev-plan-v2.docx, Структура_сайта.docx, ТЗ_AMF.docx,
> CLAUDE.md, TASKS.md, CURRENT_STATE.md и реальной структуры файлов проекта.
> Дата: 2026-03-03

---

## 🔴 КРИТИЧЕСКИЕ — сломают работу при разработке

---

### [CRIT-1] Prisma 7: неверный import path в prisma.ts

**Файл:** `src/shared/lib/prisma.ts`

**Текущий код:**

```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

**CLAUDE.md требует:**

```ts
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
```

**Проблема:** CLAUDE.md явно говорит импортировать из `@/generated/prisma/client` и всегда использовать `PrismaPg` адаптер. Текущая реализация этому не следует.

**Дополнительно:** `@prisma/adapter-pg` и `pg` — НЕ добавлены в `package.json` как зависимости, хотя указаны в `next.config.ts` в `serverExternalPackages`. Если код перепишут по CLAUDE.md — получат ошибку "module not found".

**Нужно решить:** либо обновить `prisma.ts` + добавить зависимости, либо скорректировать CLAUDE.md под текущую рабочую реализацию.

---

### [CRIT-2] prisma/schema.prisma: нет output в generator + URL в двух местах

**Файл:** `prisma/schema.prisma`

**Текущий generator:**

```prisma
generator client {
  provider = "prisma-client-js"
  // output НЕ задан → генерирует в node_modules/@prisma/client
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ← указан здесь
}
```

**CLAUDE.md говорит:**

- Импортировать из `@/generated/prisma/client` (значит нужен `output = "../src/generated/prisma/client"`)
- URL убран из datasource, подключается через `prisma.config.ts`
- `prisma.config.ts` уже содержит `datasource: { url: process.env['DATABASE_URL'] }` (дублирование)

**Проблема:** Без `output` в генераторе — `@/generated/prisma/client` не существует. Если разработчик будет следовать CLAUDE.md и напишет `import from '@/generated/prisma/client'` — получит ошибку.

---

### [CRIT-3] FSD директории не созданы, хотя Sprint 0 помечен как DONE

**CURRENT_STATE.md утверждает:** "Спринт 0 — DONE, все директории созданы и готовы"

**Реальность — этих папок НЕТ:**

- `src/pages/`
- `src/widgets/`
- `src/features/`
- `src/entities/`
- `src/shared/config/`
- `src/shared/types/`
- `src/shared/api/`

Есть только: `src/shared/ui/`, `src/shared/hooks/`, `src/shared/lib/`

**Проблема:** Разработчик начнёт работу, захочет создать `widgets/hero-slider/` — и обнаружит, что базовой структуры нет.

---

### [CRIT-4] Нет route-групп (public) и (admin)

**ТЗ и CLAUDE.md требуют:**

```
src/app/(public)/page.tsx       ← главная
src/app/(public)/offices/
src/app/(admin)/[adminSlug]/
```

**Реальность:**

```
src/app/page.tsx                ← дефолтная Next.js заглушка, без route-групп
```

Все страницы Спринта 1 должны создаваться в `(public)/`, но эта папка не существует.

---

### [CRIT-5] src/app/page.tsx — дефолтная Next.js заглушка

Текущий `page.tsx` содержит шаблон create-next-app (Next.js лого, ссылки на Vercel, "To get started, edit the page.tsx"). Это не страница проекта. Нужно заменить при создании главной страницы.

---

### [CRIT-6] Auth: signIn page указывает на /login, которого нет в структуре

**Файл:** `src/auth.config.ts`

```ts
pages: {
  signIn: '/login'
}
```

**Проблема:** В ТЗ нет страницы `/login`. Вход в админку происходит через `ADMIN_SLUG` + форму входа, которая должна быть частью `(admin)/[adminSlug]/` роута. Отдельный `/login` маршрут не предусмотрен ТЗ и не защищён middleware (т.к. не совпадает с `ADMIN_SLUG`). Любой пользователь увидит страницу входа.

---

## 🟠 ВАЖНЫЕ — несостыковки с ТЗ, влияют на функционал

---

### ~~[WARN-1] TopBar виджет~~ — ЗАКРЫТО ✅

TopBar **удалён из проекта** — согласовано с заказчиком 2026-03-04. Проект будет без TopBar.

---

### [WARN-2] Страница /about помещена в Backlog, но требуется в навигации

**dev-plan-v2.docx (раздел 3.1 Header navigation):**

> "О нас → /about (или секция на главной)"

**Структура сайта (документ):** Пункт 5 — "О бизнес-центре" — полноценный раздел с описанием, историей, инфраструктурой.

**ТЗ_AMF:** Header содержит пункт "О нас" в навигации.

**TASKS.md:** Помещено в Backlog как "Страница 'О нас' `/about`".

**Проблема:** Header будет разработан в Sprint 1 с пунктом "О нас" в меню — куда он будет вести? Или этот пункт убрать из навигации на Sprint 1?

---

### [WARN-3] Защита admin: брутфорс-блокировка не в задачах

**dev-plan-v2 (раздел 6.1):**

> "После 5 неверных попыток — блокировка IP на 15 мин (in-memory Map или Redis)"

**В TASKS.md** и **CLAUDE.md** — этого требования нет ни в одной задаче.

Текущий `auth.ts` — простой authorize без счётчика попыток.

---

### [WARN-4] Content Security Policy (CSP) не реализована

**dev-plan-v2 (раздел 10.2):**

> "Content Security Policy: настраивается в next.config.ts с учётом карты и загрузки изображений"

**next.config.ts** содержит только:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy

CSP не настроена. Без CSP карты (Яндекс/2GIS) и изображения из внешних источников могут блокироваться браузером после её добавления — нужно планировать заранее.

---

### [WARN-5] @prisma/adapter-pg и pg не в package.json

**next.config.ts:**

```ts
serverExternalPackages: ['@prisma/adapter-pg', 'pg']
```

Но в `package.json` — этих пакетов нет в `dependencies` или `devDependencies`.

Если CLAUDE.md-подход с адаптером будет реализован — `npm install @prisma/adapter-pg pg` обязателен.

---

### [WARN-6] Ветки Git не совпадают с dev-plan-v2

**dev-plan-v2 (раздел 13):**

> "Ветки: main (production), develop (staging), feature/название-задачи, fix/название-бага"
> "Каждая задача — отдельная feature-ветка от develop. Мержится через PR."

**Реальность:** Ветки `main`, `dev-1`, `dev-2`. Нет ветки `develop`. Feature-ветки создаются от `dev-1`/`dev-2`, а не от `develop`.

Это осознанное изменение workflow для 2 разработчиков, но стоит зафиксировать чтобы не было путаницы при работе с PR.

---

### [WARN-7] Расположение Docker файлов

**dev-plan-v2 (раздел 2.3, дерево директорий):**

```
docker/
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

**Реальность:**

```
Dockerfile          ← в корне
docker-compose.yml  ← в корне
docker/nginx.conf   ← в docker/
```

Это изменение логично (docker-compose и Dockerfile в корне — стандарт), но расходится с ТЗ.

---

### [WARN-8] Версия Next.js: ТЗ говорит v15, установлена v16.1.6

**dev-plan-v2:** "Next.js 15, App Router, React 19"

**package.json:** `"next": "16.1.6"`

**Следствия:**

- В Next.js 16 `middleware.ts` переименован в `proxy.ts` (предупреждение при запуске)
- API могут отличаться от описанных в ТЗ

---

## 🟡 НЕКРИТИЧНЫЕ — рекомендации и недостающие детали

---

### [INFO-1] Twitter Card мета не упомянута в CLAUDE.md/TASKS.md

**dev-plan-v2 (раздел 7.1):**

> "Twitter Card: summary_large_image"

В CLAUDE.md и TASKS.md Twitter Card не упоминается. Нужно добавить в `generateMetadata` каждой страницы.

---

### [INFO-2] Dashboard: "быстрые ссылки" не в задаче S3-D1-02

**dev-plan-v2 (раздел 6.2):**

> "Dashboard: счётчики + последние 5 заявок + Быстрые ссылки на разделы"

**TASKS.md S3-D1-02:** "Dashboard. Счётчики... Последние 5 заявок." — быстрые ссылки не упомянуты.

---

### [INFO-3] Hero-слайдер: высота 100svh на мобильных

**dev-plan-v2 (раздел 9.2):**

> "Hero-слайдер: высота 100svh на мобильных (svh для учёта тулбара браузера)"

В CLAUDE.md и TASKS.md не упоминается `svh` — только общее "полноэкранный". Нужно учесть при разработке `widgets/hero-slider`.

---

### [INFO-4] Dropdown меню: аккордеон на мобильных

**dev-plan-v2 (раздел 9.2):**

> "Dropdown в меню: на мобильных раскрывается как аккордеон, не как hover-dropdown"

В TASKS.md S1-D1-09 описан "бургер → drawer" для мобильных, но поведение dropdown "Доп. услуги" внутри drawer не уточнено.

---

### [INFO-5] Autoprefixer не упомянут в требованиях

**dev-plan-v2 (раздел 9.3):**

> "Autoprefixer — обязательно (postcss конфиг в Next.js)"

Next.js включает Autoprefixer автоматически, дополнительной настройки не требуется. Но в `package.json` нет явного `postcss.config.js`. Это нормально для Next.js 15+, но стоит проверить.

---

### [INFO-6] shared/config/, shared/types/, shared/api/ не созданы

FSD требует эти папки в `src/shared/`. По CLAUDE.md они должны быть, но в Sprint 0 не созданы. Можно создавать по мере необходимости.

---

## Итого по приоритетам

| Приоритет      | Кол-во | Действие                               |
| -------------- | ------ | -------------------------------------- |
| 🔴 КРИТИЧЕСКИЕ | 6      | Решить до начала Sprint 1              |
| 🟠 ВАЖНЫЕ      | 8      | Решить в ходе соответствующих спринтов |
| 🟡 НЕКРИТИЧНЫЕ | 6      | Учесть при реализации конкретных задач |

---

## Предлагаемые решения для критических

| #      | Проблема                   | Решение                                                                                                                |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| CRIT-1 | prisma.ts импорт и адаптер | Согласовать с командой: либо добавить adapter-pg + поменять import, либо обновить CLAUDE.md под текущий рабочий подход |
| CRIT-2 | schema.prisma output       | Добавить `output` в generator ИЛИ убрать упоминание `@/generated/` из CLAUDE.md                                        |
| CRIT-3 | FSD папки не созданы       | Создать папки `.gitkeep` для всех FSD слоёв в начале Sprint 1                                                          |
| CRIT-4 | Нет route-групп            | Создать `src/app/(public)/` при старте Sprint 1                                                                        |
| CRIT-5 | Заглушка page.tsx          | Заменить в Sprint 1 при создании главной страницы                                                                      |
| CRIT-6 | /login страница            | Переместить логику входа в `(admin)/[adminSlug]/login/` или использовать встроенный NextAuth redirect                  |
