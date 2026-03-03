# CURRENT_STATE.md — Текущее состояние проекта для Claude Code

> Этот файл читать ПЕРВЫМ при каждой новой сессии.
> Содержит актуальный статус: что сделано, что предстоит, как работать.

---

## Репозиторий

**GitHub:** https://github.com/GANSGX/business-center-commercial-office
**Канбан доска:** https://github.com/users/GANSGX/projects/2
**Рабочая папка проекта:** `project/` (именно здесь все файлы Next.js)

---

## Разработчики

| Разработчик | GitHub    | Ветка   |
| ----------- | --------- | ------- |
| Dev 1       | GANSGX    | `dev-1` |
| Dev 2       | xBezumiex | `dev-2` |

---

## Статус спринтов

| Спринт                             | Статус  | Issues         |
| ---------------------------------- | ------- | -------------- |
| Спринт 0 — Инфраструктура          | ✅ DONE | #1–#16 закрыты |
| Спринт 1 — Главная + Каталог       | 🔲 Todo | #17–#36        |
| Спринт 2 — Карточка + Услуги       | 🔲 Todo | #37–#53        |
| Спринт 3 — Административная панель | 🔲 Todo | #54–#70        |
| Спринт 4 — SEO + Деплой            | 🔲 Todo | #71–#82        |

---

## Что уже создано (Спринт 0)

### Стек и конфигурация

- **Next.js 15** + React 19 + TypeScript 5 strict
- **Turbopack** включён (`npm run dev`)
- **ESLint** + **Prettier** + **Husky** (pre-commit форматирование)
- **GitHub Actions CI** — `.github/workflows/ci.yml` (lint + typecheck + build на каждый push)

### Архитектура (FSD)

Все директории созданы и готовы:

```
src/
├── app/          ← Next.js App Router (роуты)
├── pages/        ← Page-компоненты (сборка виджетов)
├── widgets/      ← Самодостаточные блоки UI
├── features/     ← Пользовательские действия
├── entities/     ← Бизнес-сущности
└── shared/       ← Атомарные переиспользуемые вещи
```

### База данных

- `prisma/schema.prisma` — полная схема со всеми моделями
- `prisma/seed.ts` — тестовые данные (6 офисов, слайды, преимущества, услуги, галерея)
- Миграции запускать: `npx prisma migrate dev`

### Аутентификация

- `auth.ts` — NextAuth.js v5, credentials provider, bcrypt
- `src/app/api/auth/[...nextauth]/route.ts` — роут

### Middleware

- `src/middleware.ts` — защита админки через `ADMIN_SLUG`
- При неверном slug → 404 (не 401)
- Добавляет `X-Robots-Tag: noindex` для admin-запросов

### Стили

- `src/styles/globals.css` — все CSS переменные (цвета, типографика, отступы, тени)
- `src/app/globals.css` — подключение через layout.tsx
- Шрифт: Inter (cyrillic + latin), подключён через `next/font`

### Готовые UI компоненты (`src/shared/ui/`)

| Компонент  | Файлы                                  |
| ---------- | -------------------------------------- |
| Button     | Button.tsx + Button.module.css         |
| Badge      | Badge.tsx + Badge.module.css           |
| Input      | Input.tsx + Input.module.css           |
| Textarea   | Textarea.tsx + Textarea.module.css     |
| Checkbox   | Checkbox.tsx + Checkbox.module.css     |
| Modal      | Modal.tsx + Modal.module.css           |
| Spinner    | Spinner.tsx + Spinner.module.css       |
| Pagination | Pagination.tsx + Pagination.module.css |

Все экспортируются через `src/shared/ui/index.ts`.

### Готовые хуки (`src/shared/hooks/`)

- `useDebounce.ts` — дебаунс для полей ввода
- `useIntersection.ts` — IntersectionObserver для ленивой загрузки
- `useMediaQuery.ts` — медиазапросы в JS

### Утилиты (`src/shared/lib/`)

- `prisma.ts` — singleton Prisma клиент
- `jsonld.ts` — утилиты для JSON-LD (BreadcrumbList, Organization)

### Инфраструктура

- `Dockerfile` — multi-stage (deps → builder → runner)
- `docker-compose.yml` — профили `dev` и `prod`
- `docker/nginx.conf` — HTTP→HTTPS, gzip, cache headers
- `.env.example` — все переменные окружения с описанием

### Прочее

- `src/app/api/health/route.ts` — healthcheck endpoint
- `src/app/not-found.tsx` — кастомная 404
- `scripts/create-admin.ts` — создание admin-пользователя
- `scripts/hash-password.ts` — генерация bcrypt хеша

---

## Как начать работу (для нового разработчика)

```bash
# 1. Клонировать репо
git clone https://github.com/GANSGX/business-center-commercial-office.git
cd business-center-commercial-office

# 2. Установить зависимости
npm install

# 3. Скопировать и заполнить env
cp .env.example .env.local
# Заполнить DATABASE_URL, NEXTAUTH_SECRET, ADMIN_SLUG и т.д.

# 4. Запустить PostgreSQL
docker compose up postgres-exposed
# (или docker compose --profile dev up)

# 5. Применить миграции
npx prisma migrate dev

# 6. Заполнить тестовыми данными
npx prisma db seed

# 7. Запустить сервер
npm run dev
# → http://localhost:3000
```

---

## Как работать с задачами

1. Открыть канбан: https://github.com/users/GANSGX/projects/2
2. Взять issue из **Todo** → назначить себя (Assignees) → перевести в **In Progress**
3. Создать ветку от своей (`dev-1` или `dev-2`):
   ```bash
   git checkout dev-2
   git pull origin dev-2
   git checkout -b feature/sprint1-room-card
   ```
4. Сделать работу, закоммитить:
   ```bash
   git commit -m "feat: add room-card widget"
   ```
5. Запушить и закрыть issue:
   ```bash
   git push -u origin feature/sprint1-room-card
   # В PR написать: Closes #18
   # После merge → issue автоматически закрывается → Done на доске
   ```

---

## Ключевые правила (из CLAUDE.md)

- **Tailwind запрещён** — только CSS Modules + CSS переменные
- **UI-библиотеки запрещены** — все компоненты пишутся вручную
- **FSD строго** — импорты только вниз: app → pages → widgets → features → entities → shared
- **ADMIN_SLUG** — только `process.env.ADMIN_SLUG`, никогда не хардкодить
- **Коммиты** — Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`
- **Файлы нельзя трогать без согласования обоих разработчиков:**
  - `prisma/schema.prisma`
  - `src/styles/globals.css`
  - `docker-compose.yml`
  - `src/middleware.ts`
  - `.env.example`

---

## Полезные команды

```bash
npm run dev          # Запуск (Turbopack)
npm run build        # Продакшн сборка
npm run lint         # ESLint
npm run typecheck    # TypeScript проверка

npx prisma studio    # GUI для БД
npx prisma migrate dev --name "название"
npx prisma generate  # Обновить типы после изменения схемы

docker compose --profile dev up    # Запуск всего в Docker
docker compose up postgres-exposed # Только PostgreSQL
```

---

> Полные инструкции по проекту — в папке `claude-instructions/`:
>
> - `CLAUDE.md` — стек, архитектура, CSS, БД, API, правила
> - `SETUP.md` — настройка репозитория, GitHub Projects, Docker
> - `TASKS.md` — все задачи по спринтам
