# Сисадмин — БЦ «Коммунистическая, 35»

---

## Первый запуск

```bash
git clone https://github.com/GANSGX/business-center-commercial-office.git
cd business-center-commercial-office
cp .env.example .env
# заполнить .env (см. раздел ниже)
npm install --legacy-peer-deps
npm run setup   # накатывает БД + создаёт admin-пользователя
npm run build
npm start       # порт 3000
```

---

## Переменные окружения (.env)

| Переменная                 | Что указать                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`             | Строка подключения PostgreSQL от Timeweb                                        |
| `NEXTAUTH_URL`             | `https://k35-bc.ru`                                                             |
| `NEXTAUTH_SECRET`          | Случайная строка 32+ символа                                                    |
| `ADMIN_SLUG`               | Секретный путь к админке, например `bc-panel-k35-2025`. Не «admin», не «panel». |
| `ADMIN_EMAIL`              | Логин для входа в админку                                                       |
| `ADMIN_PASSWORD`           | Пароль для входа в админку                                                      |
| `RESEND_API_KEY`           | API-ключ из кабинета resend.com                                                 |
| `EMAIL_TO`                 | Куда приходят уведомления о заявках с сайта                                     |
| `EMAIL_FROM`               | Оставить `onboarding@resend.dev`                                                |
| `NEXT_PUBLIC_MAP_PROVIDER` | Оставить `yandex`                                                               |

---

## Вход в админку

```
https://k35-bc.ru/<ADMIN_SLUG>
```

Логин и пароль — те, что в `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## Обновление сайта (Docker)

Сервер работает через Docker Compose. Node/npm на хосте **не установлены** — все команды через `docker compose exec`.

### Стандартный деплой (только код, без изменений схемы БД)

```bash
# 1. Сохранить серверные конфиги (Dockerfile, docker-compose.yml, nginx.conf)
git stash push -m "server-configs-$(date +%Y-%m-%d)"

# 2. Подтянуть новый код
git pull origin main

# 3. Восстановить серверные конфиги
git stash pop

# 4. Пересобрать и перезапустить app-контейнер
docker compose up --build -d app

# 5. Проверить
curl -s https://k35-bc.ru/api/health
```

### Если в коммите есть изменения схемы Prisma

Признак: в commit-сообщении есть слова `prisma`, `schema`, `migrate`, `ADD COLUMN` или новые модели.

Prisma CLI внутри prod-контейнера недоступен — миграцию применяем через **psql напрямую**.

```bash
# Посмотреть какие колонки нужно добавить (из diff схемы)
git diff HEAD~1 prisma/schema.prisma

# Добавить колонки вручную через postgres-контейнер
docker compose exec postgres psql -U postgres -d businesscenter -c '
  ALTER TABLE "ИмяМодели" ADD COLUMN IF NOT EXISTS "поле1" TEXT;
  ALTER TABLE "ИмяМодели" ADD COLUMN IF NOT EXISTS "поле2" INTEGER DEFAULT 0;
'

# Затем стандартный деплой (шаги 1–5 выше)
docker compose up --build -d app
```

> `IF NOT EXISTS` — безопасно, не падает если колонка уже есть.

### Типы данных Prisma → PostgreSQL

| Prisma     | SQL тип            |
| ---------- | ------------------ |
| `String?`  | `TEXT`             |
| `String`   | `TEXT NOT NULL`    |
| `Int`      | `INTEGER NOT NULL` |
| `Int?`     | `INTEGER`          |
| `Boolean`  | `BOOLEAN NOT NULL` |
| `Float?`   | `DOUBLE PRECISION` |
| `DateTime` | `TIMESTAMP(3)`     |

### Посмотреть логи

```bash
docker compose logs --tail=50 app
docker compose ps
```

---

## Смена пароля администратора

Изменить `ADMIN_PASSWORD` в `.env`, затем:

```bash
npm run setup
```

---

## Проверка что сайт работает

```
https://k35-bc.ru/api/health → {"ok":true}
```

---

## Загруженные фото

Хранятся в `public/uploads/` — включить в бэкап вместе с БД.
