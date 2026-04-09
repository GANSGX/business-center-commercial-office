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

## Обновление сайта

```bash
git pull origin main
npm install --legacy-peer-deps
npm run setup   # только если были изменения в БД (в commit-сообщении будет "prisma" или "migrate")
npm run build
pm2 restart all  # или systemctl restart, зависит от того как запущен
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
