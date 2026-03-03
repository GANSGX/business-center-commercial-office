# Business Center — Сайт бизнес-центра

Публичный сайт с каталогом помещений и скрытой CMS-админкой.

## Стек

- Next.js 15, React 19, TypeScript 5
- CSS Modules, PostgreSQL 16 + Prisma, NextAuth.js v5
- Docker + Nginx

## Быстрый старт (разработка)

```bash
# 1. Клонировать
git clone https://github.com/GANSGX/business-center-commercial-office.git
cd business-center-commercial-office

# 2. Настроить переменные окружения
cp .env.example .env.local
# Заполнить .env.local

# 3. Установить зависимости
npm install

# 4. Запустить базу данных
docker compose up postgres-exposed

# 5. Применить миграции и заполнить данными
npx prisma migrate dev
npx prisma db seed

# 6. Создать администратора
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword npx ts-node scripts/create-admin.ts

# 7. Запустить сервер
npm run dev
```

## Деплой на сервер

```bash
# 1. Клонировать на сервер
git clone https://github.com/GANSGX/business-center-commercial-office.git
cd business-center-commercial-office

# 2. Настроить переменные окружения
cp .env.example .env
# Заполнить .env реальными данными

# 3. Положить SSL-сертификаты
mkdir -p docker/certs
# Скопировать fullchain.pem и privkey.pem в docker/certs/

# 4. Запустить prod-сборку
docker compose --profile prod up --build -d

# 5. Применить миграции
docker compose exec app npx prisma migrate deploy

# 6. Создать администратора
docker compose exec app npx ts-node scripts/create-admin.ts
```

## Полезные команды

```bash
npm run dev          # Разработка с Turbopack
npm run build        # Продакшн сборка
npm run lint         # ESLint
npm run typecheck    # TypeScript проверка

npx prisma studio    # GUI для базы данных
npx prisma migrate dev --name "название"
npx prisma db seed
```

## Ветки

| Ветка   | Назначение                |
| ------- | ------------------------- |
| `main`  | Production                |
| `dev-1` | Разработчик 1 (GANSGX)    |
| `dev-2` | Разработчик 2 (xBezumiex) |
