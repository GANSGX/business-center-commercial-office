# SETUP.md — Как запустить проект и настроить репозиторий

---

## 1. Создание репозитория на GitHub

```bash
# Создать репо через GitHub CLI (установить: https://cli.github.com)
gh repo create business-center --private --clone
cd business-center

# Или вручную на github.com → New repository → business-center → private
```

---

## 2. Настройка веток

```bash
# Убедиться что стоим на main
git checkout -b main
git push -u origin main

# Создать develop
git checkout -b develop
git push -u origin develop

# Защитить ветки (через GitHub UI или CLI):
# Settings → Branches → Add rule
# main: require PR, no force push
# develop: require PR
```

---

## 3. Клонирование и первичная настройка (оба разработчика)

```bash
git clone https://github.com/<your-username>/business-center.git
cd business-center

# Скопировать env
cp .env.example .env.local
# Заполнить .env.local

# Установить зависимости
npm install

# Применить миграции БД
npx prisma migrate dev

# Заполнить тестовыми данными
npx prisma db seed

# Создать admin-пользователя
npx ts-node scripts/create-admin.ts

# Запустить дев-сервер
npm run dev
```

---

## 4. Ветки для разработчиков

```bash
# Dev 1 — работает в ветках:
git checkout develop
git checkout -b feature/dev1-sprint0-infra
# ... работа ...
git push -u origin feature/dev1-sprint0-infra
# Открыть PR в develop через: gh pr create --base develop

# Dev 2 — работает в ветках:
git checkout develop
git checkout -b feature/dev2-sprint0-docker
git push -u origin feature/dev2-sprint0-docker
```

### Соглашение по именованию веток:

```
feature/dev1-sprint0-infra
feature/dev1-sprint1-homepage
feature/dev1-sprint2-room-card
feature/dev2-sprint0-docker
feature/dev2-sprint1-api-rooms
fix/dev1-header-mobile
fix/dev2-lead-rate-limit
```

---

## 5. Ежедневный workflow

```bash
# Утром перед началом работы:
git fetch origin
git merge origin/develop   # влить актуальный develop в свою ветку

# В конце дня / после задачи:
git add .
git commit -m "feat: add room-filter zustand store"
git push

# Когда задача готова — создать PR:
gh pr create --base develop --title "feat: room filter with zustand" --body "Closes #12"
```

---

## 6. GitHub Projects — создание доски

```bash
# Создать проект (Kanban) через CLI:
gh project create --owner <your-username> --title "Business Center" --format board

# Создать все задачи из TASKS.md как Issues:
# (Запустить из корня репозитория)
gh issue create --title "[S0-D1-01] Инициализация проекта" --body "Инициализация Next.js 15 + TS + ESLint + Prettier + Husky" --label "sprint-0,dev1"
# ... или использовать скрипт ниже
```

### Скрипт для массового создания Issues из TASKS.md:

```bash
# scripts/create-issues.sh
# Запустить: bash scripts/create-issues.sh

gh label create "sprint-0" --color "#0075ca"
gh label create "sprint-1" --color "#e4e669"
gh label create "sprint-2" --color "#d93f0b"
gh label create "sprint-3" --color "#0e8a16"
gh label create "sprint-4" --color "#6f42c1"
gh label create "dev1" --color "#1d76db"
gh label create "dev2" --color "#e11d48"
gh label create "infra" --color "#cccccc"
gh label create "blocked" --color "#ee0701"
```

> После создания Issues — добавить их в GitHub Project через UI или:

```bash
gh project item-add <project-number> --owner <username> --url <issue-url>
```

---

## 7. Настройка Claude Code для работы с проектом

Claude Code автоматически читает `CLAUDE.md` из корня репозитория.

```bash
# Установить Claude Code если нет:
npm install -g @anthropic-ai/claude-code

# Запустить в папке проекта:
claude

# Claude Code будет знать:
# - Весь стек и архитектуру (из CLAUDE.md)
# - Все задачи (из TASKS.md)
# - Правила CSS, FSD, Git (из CLAUDE.md)
```

### Полезные команды для Claude Code:

```
"Реализуй задачу S1-D1-02 (widgets/hero-slider)"
"Создай API endpoint GET /api/rooms с фильтрами"
"Напиши CSS для RoomCard в стиле проекта"
"Создай Issue для задачи S2-D1-03 в GitHub"
```

---

## 8. Docker — локальная разработка

```bash
# Dev режим (hot reload, postgres на 5432)
docker compose --profile dev up

# Prod режим (полная сборка)
docker compose --profile prod up --build

# Только база данных (если запускаете Next.js локально)
docker compose up postgres
```

---

## 9. Переменные окружения — обязательные для старта

Скопировать `.env.example` в `.env.local` и заполнить минимум:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/businesscenter"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="любая_случайная_строка_минимум_32_символа"
ADMIN_SLUG="выберите_секретный_путь"          # например: admin-bc-2025-xK9m
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH=""                         # сгенерировать: npx ts-node scripts/hash-password.ts yourpassword
EMAIL_HOST="smtp.yandex.ru"
EMAIL_PORT="465"
EMAIL_USER=""
EMAIL_PASS=""
EMAIL_TO=""
NEXT_PUBLIC_MAP_PROVIDER="yandex"
```

---

## 10. Полезные команды

```bash
npm run dev              # Запуск дев-сервера
npm run build            # Продакшн сборка
npm run lint             # ESLint
npm run typecheck        # TypeScript проверка
npx prisma studio        # GUI для базы данных
npx prisma migrate dev   # Создать миграцию
npx prisma db seed       # Заполнить тестовыми данными
npx prisma generate      # Обновить типы после изменения схемы
```
