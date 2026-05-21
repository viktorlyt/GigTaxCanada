# GigTax Canada

Canada-first mileage and vehicle expense tracking for gig drivers (Uber Eats, DoorDash, etc.). Helps you estimate T2125-style business use % and deductible vehicle expenses — **not tax advice**.

- **Product plan:** [PLAN.md](./PLAN.md)
- **Build progress:** [progress-tracker.md](./progress-tracker.md)

## Stack

| Layer        | Tech                                 |
| ------------ | ------------------------------------ |
| Monorepo     | Turborepo, npm workspaces            |
| Web          | Next.js 16 (`apps/web`)              |
| API          | NestJS 11 (`apps/api`)               |
| DB           | PostgreSQL 16 + Prisma               |
| Shared types | `@gigtax/shared` (`packages/shared`) |

## Prerequisites

- Node.js 20+
- Docker Desktop (for local Postgres)
- npm

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start database

```bash
docker compose up -d
```

Postgres listens on **host port 5434** (see `docker-compose.yml`).

### 3. API environment

```bash
cp apps/api/.env.example apps/api/.env
cd apps/api
npx prisma db push
npx prisma generate
```

### 4. Web environment

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

### 5. Run dev servers

**Terminal 1 — API (port 4000):**

```bash
cd apps/api && npm run start:dev
```

**Terminal 2 — Web (port 3000):**

```bash
cd apps/web && npm run dev
```

Or from repo root (both apps via Turbo):

```bash
npm run dev
```

### 6. Open app

- Web: http://localhost:3000
- API health: http://localhost:4000/health

Register a user or use your test account, then open **Summary**, **Trips**, **Expenses**, **Platform km**.

## Project layout

```
gig-tax-canada/
├── apps/
│   ├── api/          # NestJS + Prisma
│   └── web/          # Next.js
├── packages/
│   └── shared/       # Shared enums & types
├── docker-compose.yml
├── PLAN.md
└── progress-tracker.md
```

## API overview (JWT required except auth)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get `accessToken` |
| GET | `/auth/me` | Current user |
| GET/POST | `/trips?taxYear=2026` | List / create trips |
| GET/POST | `/expenses?taxYear=2026` | List / create expenses |
| GET/POST | `/platform-imports?taxYear=2026` | List / upsert platform km |
| GET | `/summary?taxYear=2026` | Tax year summary |
| GET | `/summary/export?taxYear=2026` | CSV export |

### Example: login + summary (curl)

```bash
export TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

curl -s "http://localhost:4000/summary?taxYear=2026" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

## Common issues

| Problem | Fix |
|---------|-----|
| Prisma P1010 / auth failed | Docker running; `DATABASE_URL` uses port **5434** |
| Web 401 | Log in again; JWT is in browser `localStorage`, not `.env` |
| CORS error | `WEB_ORIGIN=http://localhost:3000` in `apps/api/.env` |

## Disclaimer

This tool produces worksheet-style summaries for your own records. Verify numbers with CRA publications or a qualified tax professional. Keep supporting documents for **6 years**.

## License

Private — all rights reserved.
