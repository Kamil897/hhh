# StuDent-ChaT (SDCT)

Monorepo with frontend (React + Vite + TS + Zustand + Tailwind) and backend (NestJS + TS + TypeORM), MySQL via Docker, JWT auth, WebSocket-ready, and payments placeholders.

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Quick Start

### 1) Start MySQL in Docker
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
cp .env.example .env  # adjust if needed
npm run start:dev
```
Backend runs on http://localhost:3000

### 3) Frontend (Vite React)
```bash
cd /workspace/sdct-frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 with a proxy to backend at /api.

## Auth Endpoints
- POST /auth/register { email, password }
- POST /auth/login { email, password }
- GET /auth/me (Authorization: Bearer <token>)

## Tech
- Frontend: React, Vite, TypeScript, Zustand, TailwindCSS
- Backend: NestJS 11, TypeORM, MySQL, JWT, bcrypt, class-validator
- Realtime: WebSocket gateway (placeholder)
- Payments: Stripe / PayPal (placeholders)

## Env Vars
See `/workspace/.env` and `sdct-backend/.env.example`.