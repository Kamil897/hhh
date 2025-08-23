# StuDent-ChaT (SDCT)

Monorepo: Frontend (React + Vite + TS + Zustand + Tailwind) + Backend (NestJS + TypeORM) + MySQL (Docker). Includes JWT auth, profiles, store, games (REST + WebSocket), Cognia (mock LLM), complaints, and SDCT AES-256 encryption at rest.

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Quick Start

### 1) Database (MySQL via Docker)
```bash
cd /workspace
docker compose up -d
```
- Host: 127.0.0.1
- Port: 3306
- User: sdct
- Password: password
- DB: sdct

### 2) Backend (NestJS)
```bash
cd /workspace/sdct-backend
cp .env.example .env  # update values if needed
npm install
npm run start:dev
```
- Base URL: `http://localhost:3000`

### 3) Frontend (Vite React)
```bash
cd /workspace/sdct-frontend
npm install
npm run dev
```
- UI: `http://localhost:5173`
- Dev proxy: `/api` → `http://localhost:3000`

## Environment Variables (Backend)
See `sdct-backend/.env.example` for full list. Key vars:

- Database
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=3306`
  - `DB_USER=sdct`
  - `DB_PASSWORD=password`
  - `DB_NAME=sdct`
  - `DB_SYNC=true` (dev only; TypeORM sync)
- Auth
  - `JWT_SECRET=change_me`
- Payments (optional placeholders)
  - `STRIPE_DONATE_URL=`
  - `PAYPAL_DONATE_URL=`
- SDCT Encryption
  - `SDCT_ENC_KEY=` 32-byte key (hex/base64/utf8 supported). Used for AES-256-GCM. Required in prod.

Passwords are always hashed with bcrypt.

## Features

### Auth
- Email + password (JWT).
- Roles: `user`, `admin`, `super-admin`.
- Endpoints:
  - `POST /auth/register` `{ email, password }`
  - `POST /auth/login` `{ email, password }`
  - `GET /auth/me` (Bearer token)

### Profile (личный кабинет)
- Поля: nickname, prefix, avatarUrl, theme, points.
- Истории: transactions, purchases, achievements.
- API:
  - `GET /profile/me`, `PUT /profile/me`
  - `GET /profile/transactions`
  - `GET /profile/purchases`
  - `GET /profile/achievements`
  - `GET /profile/asset?itemId=...` (доступ только при покупке)
- UI: страница `/profile` (редактирование и списки).

### Store (магазин)
- Типы: avatar, prefix, background.
- Покупка за баллы: `POST /store/purchase/:itemId` (JWT).
- Список: `GET /store/items?type=...`.
- Эффект покупки: обновление профиля (avatar/prefix/theme) + транзакция.
- UI: страница `/store` (фильтры, покупка, донат-кнопки).

### Games (игры)
- Офлайн: викторина.
  - `GET /games/quiz`, `POST /games/quiz/answer` — за верный ответ начисляются баллы.
- Онлайн: Камень‑Ножницы‑Бумага (WebSocket via Socket.IO).
  - Подключение с `auth.token` (Bearer JWT).
  - События: `rps:join`, `rps:move`, ответы `rps:status`, `rps:paired`, `rps:roundResult`.
  - Победителю начисляются баллы.
- UI: `/games` (викторина + RPS).

### Cognia (чат‑ассистент)
- Модели: `phi3` (mock по умолчанию), опционально `gpt`, `llama`.
- Учителя: математика, история, языки (влияет на стиль ответа).
- Хранение истории диалога (шифруется SDCT AES-256-GCM).
- API:
  - `GET /cognia/conversations`
  - `POST /cognia/conversations` `{ model, teacher, title? }`
  - `GET /cognia/conversations/:id`
  - `POST /cognia/conversations/:id/messages` `{ content }`
- UI: `/cognia` (выбор модели/учителя, диалоги, чат).

### Complaints (жалобы)
- Пользователь: `POST /complaints` `{ category, text }` (текст шифруется SDCT).
- Админ: `GET /complaints?status=open|resolved|rejected`, `POST /complaints/:id/resolve`, `POST /complaints/:id/reject`.
- UI: `/report` (отправка жалобы), `/admin` → вкладка Complaints.

### Admin / Super‑admin
- Модерация пользователей: бан/мут/разбан.
  - `GET /admin/users`, `POST /admin/users/:id/ban|mute|unban`
- Роли (super‑admin): `POST /admin/users/:id/role` `{ role }`.
- Магазин: CRUD предметов.
  - `GET/POST/PUT/DELETE /admin/store/items`
- Cognia settings (super‑admin):
  - `GET/PUT /admin/cognia/settings` (флаги allowPhi3/allowGpt/allowLlama)
- UI: `/admin` (вкладки Users/Store/Cognia/Complaints).

### SDCT Encryption (AES‑256‑GCM)
- Сервис `SdctCryptoService`: формат `SDCTv1:<iv_b64>:<data_b64>:<tag_b64>`.
- Шифруются и помечаются SDCT:
  - Сообщения Cognia (`cognia_messages.sdctTag='SDCT'`).
  - Тексты жалоб (`complaints.sdctTag='SDCT'`).
- Расшифровка выполняется на чтение в соответствующих сервисах.

## Development Notes
- TypeORM `synchronize=true` только для разработки.
- Пароли — только bcrypt.
- WebSocket сервер: Socket.IO на бэкенде (`/socket.io`).
- Донат: заглушки, задайте `STRIPE_DONATE_URL` / `PAYPAL_DONATE_URL` для кнопок в UI.