# CLAUDE.md — БЦ Коммунистическая, 35

Инструкции для Claude Code и всех AI-агентов в этом проекте.

---

## Быстрый старт (новый разработчик)

```bash
cp .env.local.example .env.local   # заполни ADMIN_SLUG своим значением
npm install --legacy-peer-deps
npm run db:up                      # поднять PostgreSQL в Docker
npm run setup                      # migrate + seed (создаёт admin-юзера)
npm run dev                        # запустить сервер
```

Логин в админку: `http://localhost:3000/<ADMIN_SLUG>`

---

## Стек

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript 5 strict**
- **CSS Modules** + CSS Custom Properties — **NO Tailwind**, **NO UI библиотек**
- **PostgreSQL 16** + **Prisma 7** (стандартный PrismaClient, без adapter для TCP)
- **NextAuth v5** (JWT, Credentials provider)
- **Zustand** (только глобальный стейт), **React Hook Form + Zod**

---

## Критические правила

### Что нельзя трогать без согласования обоих разрабов:

- `prisma/schema.prisma`
- `src/styles/globals.css`
- `docker-compose.yml`
- `src/middleware.ts` (или `src/proxy.ts`)
- `.env.example`

### Архитектура — FSD (Feature Sliced Design):

Импорты только **вниз**: `app → pages/views → widgets → features → entities → shared`

### Стиль кода:

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Без подписей Claude в коммитах
- ADMIN_SLUG — только через `process.env.ADMIN_SLUG`, никогда хардкодить

---

## Cookie-аналитика — синхронизация с consent

### Как работает:

```
Пользователь заходит
       ↓
CookieBanner показывается (localStorage: 'cookie_consent' не задан)
       ↓
Принял → localStorage: 'cookie_consent' = 'accepted'
       ↓
AnalyticsTracker начинает трекать pageview (кука bc_visitor, 1 год)
       ↓
POST /api/analytics/pageview → таблица PageView в БД
       ↓
GET /api/analytics (admin only) → дашборд
```

### Ключевые файлы:

| Файл                                                    | Назначение                                                |
| ------------------------------------------------------- | --------------------------------------------------------- |
| `src/widgets/cookie-banner/ui/CookieBanner.tsx`         | Баннер, пишет `cookie_consent` в localStorage             |
| `src/widgets/analytics-tracker/ui/AnalyticsTracker.tsx` | Трекер, читает `cookie_consent`, ставит куку `bc_visitor` |
| `src/app/api/analytics/pageview/route.ts`               | POST — сохраняет pageview                                 |
| `src/app/api/analytics/route.ts`                        | GET — агрегированная статистика для дашборда              |
| `src/app/(public)/layout.tsx`                           | Оба компонента подключены здесь                           |

### Правило синхронизации (ОБЯЗАТЕЛЬНО):

> AnalyticsTracker ДОЛЖЕН проверять `localStorage.getItem('cookie_consent') === 'accepted'`
> перед любым трекингом. Без согласия — ничего не пишем.

### Ключи localStorage:

- `cookie_consent` — `'accepted'` | `'declined'` (управляет CookieBanner)

### Cookie браузера:

- `bc_visitor` — анонимный UUID посетителя, срок 1 год, SameSite=Lax

---

## Политика конфиденциальности — что трекаем

Файлы: `public/privacy-policy.txt` и `src/app/(public)/privacy/_page/PrivacyPage.tsx`

Что фиксируем в `PageView`:

- `path` — URL страницы (без домена)
- `referrer` — источник перехода
- `device` — `mobile` | `desktop` (по User-Agent)
- `visitorId` — cookie `bc_visitor` (обезличенный)
- `createdAt` — время визита

**Не собираем:** IP-адрес, email, имя, точное местоположение.
**Не передаём** третьим лицам.
**Трекаем только** при `cookie_consent === 'accepted'`.

---

## Prisma — важные детали

```bash
npm run setup          # migrate deploy + seed (для любого окружения)
npx prisma migrate dev --name <name>  # только в разработке (создаёт migration file)
npx prisma generate    # регенерировать client после изменений схемы
```

После каждого изменения `schema.prisma` → обязательно `npx prisma generate`.

Seed автоматически создаёт admin-юзера из `ADMIN_EMAIL` + `ADMIN_PASSWORD` в `.env`.

---

## .env переменные

| Переменная                 | Описание                                      |
| -------------------------- | --------------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string                  |
| `NEXTAUTH_SECRET`          | Минимум 32 символа                            |
| `NEXTAUTH_URL`             | URL сайта (http://localhost:3000 для локалки) |
| `ADMIN_SLUG`               | Скрытый путь к админке, **только серверная**  |
| `ADMIN_EMAIL`              | Логин администратора                          |
| `ADMIN_PASSWORD`           | Пароль (bcrypt хешируется в seed)             |
| `NEXT_PUBLIC_MAP_PROVIDER` | `yandex` или `2gis`                           |

---

## Git workflow

```bash
git checkout -b feature/sprint1-название   # от dev-2
# ... делаем изменения ...
git push origin feature/sprint1-название
# PR с Closes #N → merge в dev-2
```

Синхронизация с dev-1:

```bash
git fetch origin
git merge origin/dev-1   # fast-forward если нет конфликтов
git push origin dev-2
```

---

## Структура проекта

```
src/
  app/
    (admin)/[adminSlug]/   — админ-панель
    (public)/              — публичный сайт
    api/                   — API routes
  widgets/                 — крупные UI-блоки (header, footer, lead-form, analytics-tracker...)
  features/                — интерактивные фичи
  entities/                — бизнес-сущности (room, lead...)
  shared/                  — ui, hooks, lib
  views/                   — page-level компоненты (бывший pages/)
```

<!-- code-review-graph MCP tools -->

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool                        | Use when                                               |
| --------------------------- | ------------------------------------------------------ |
| `detect_changes`            | Reviewing code changes — gives risk-scored analysis    |
| `get_review_context`        | Need source snippets for review — token-efficient      |
| `get_impact_radius`         | Understanding blast radius of a change                 |
| `get_affected_flows`        | Finding which execution paths are impacted             |
| `query_graph`               | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes`     | Finding functions/classes by name or keyword           |
| `get_architecture_overview` | Understanding high-level codebase structure            |
| `refactor_tool`             | Planning renames, finding dead code                    |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
