# GigTax Canada — Progress Tracker

> **How to use:** Update this file after every **big stage** (a numbered build step or a major feature slice). Mark stages ✅ when verified (curl, browser, or deploy). Link PRs/commits optionally in **Notes**.

**Last updated:** 2026-07-28  
**Product wedge:** Multi-platform km reconciliation + expense business-use % (vs RideWiz auto-GPS)  
**Stack:** Turborepo · Next.js (`apps/web`) · NestJS (`apps/api`) · PostgreSQL · Prisma · `@gigtax/shared`  
**Production:** https://gigtaxcanada.com · API https://api.gigtaxcanada.com

---

## Quick status

| Area | Status |
|------|--------|
| Monorepo + shared package | ✅ Done |
| API (auth, trips, expenses, summary, platform imports, odometer) | ✅ Done |
| Web (login + dashboard) | ✅ Done |
| Web (trips / expenses / import / odometer forms) | ✅ Done |
| PWA + README | ✅ Done |
| Deploy beta | ✅ Done |
| Stable API hostname (named tunnel + own domain) | ✅ Done |
| Monetization (Stripe) | ⬜ Deferred |
| Accountant B2B | ⬜ Deferred |

---

## Build stages (step-by-step)

### ✅ Stage 1 — Monorepo root

- [x] Root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- [x] `turbo.json`, `.gitignore`, `apps/`, `packages/`
- [x] `npm i` at root

**Notes:** Foundation for `turbo dev` / `turbo build`.

---

### ✅ Stage 2 — `@gigtax/shared`

- [x] Enums: `TripPurpose`, `GigPlatform`, `ExpenseCategory`
- [x] `PLATFORM_LABELS`, `TaxYearSummary` (incl. `platformReportedKm`, `platformKmGap`, odometer + warn flags)

**Notes:** Single source of truth for web + API labels.

---

### ✅ Stage 3 — Next.js `apps/web`

- [x] `create-next-app` in `apps/web` (App Router, TypeScript, Tailwind)
- [x] Workspace dependency on `@gigtax/shared`
- [x] Dev server on `:3000`

---

### ✅ Stage 4 — NestJS `apps/api`

- [x] Nest scaffold in `apps/api`
- [x] CORS, `/health`, port `4000`
- [x] `void bootstrap()` fix

---

### ✅ Stage 5 — PostgreSQL + Prisma

- [x] `docker-compose.yml` — Postgres 16 (`gigtax-db`)
- [x] Host port **5434** (5432 conflict with local Postgres)
- [x] Prisma schema: `User`, `Trip`, `Expense` (+ enums)
- [x] `PrismaModule` / `PrismaService` in `apps/api/prisma/`
- [x] `/health` returns `db: true`

**Env:** `DATABASE_URL=postgresql://gigtax:gigtax@127.0.0.1:5434/gigtax?schema=public&sslmode=disable`

---

### ✅ Stage 6 — Auth (JWT)

- [x] `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- [x] JWT guard, `CurrentUser` decorator
- [x] DTOs + `ValidationPipe`
- [x] `JWT_SECRET`, `JWT_EXPIRES_IN` in `apps/api/.env`

**Verified:** register/login/me with curl.

---

### ✅ Stage 7 — Trips CRUD

- [x] `GET/POST/PATCH/DELETE /trips` with `taxYear` query
- [x] JWT-scoped to current user

**Verified:** business trip 12.5 km Uber Eats.

---

### ✅ Stage 8 — Expenses CRUD

- [x] `GET/POST/PATCH/DELETE /expenses` with `taxYear` query
- [x] Categories from Prisma / shared enums

**Verified:** FUEL + INSURANCE test data.

---

### ✅ Stage 9 — Tax year summary + export

- [x] `GET /summary?taxYear=`
- [x] `GET /summary/export` (CSV)
- [x] Business %, deductible expenses, `potentialMissedDeduction`

**Verified:** 2026 summary ~$2,531 deductible at 100% business use (before platform import).

---

### ✅ Stage 10 — Platform km import

- [x] Prisma `PlatformImport` model
- [x] `POST/GET /platform-imports`
- [x] Summary includes `platformReportedKm`; `businessKm` = platform + manual business trips

**Verified:** Uber Eats 8500 km → `businessKm` 8512.5 (8500 + 12.5).

---

### ✅ Stage 11 — Web MVP (login + dashboard)

- [x] `apps/web/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:4000`
- [x] `src/lib/auth.ts`, `src/lib/api.ts`
- [x] `/login` — sign in / register, JWT in `localStorage`
- [x] `/dashboard` — tax year summary from API
- [x] `/` → redirect `/login`
- [x] Layout metadata “GigTax Canada”
- [x] Full-height layout (`min-h-screen` on login + dashboard)

**Verified in browser:** $2,531 deductible, 8512.5 business km, 8500 platform km.

**Test user:** `driver@test.com` / `password123`

---

### ✅ Stage 12 — Web: trips, expenses, platform import UI

- [x] List + create trip (mobile-first form)
- [x] List + create expense
- [x] Platform km import form (upsert per platform/year)
- [x] Nav between dashboard and data entry pages (`AppNav`)
- [x] CSV export button on dashboard

**Verified in browser:** `/trips`, `/expenses`, `/import` + dashboard links.

---

### ✅ Stage 13 — PWA + developer docs

- [x] `manifest.json`, icons, installable PWA basics
- [x] Root `README.md` — docker, env, `npm run dev`, curl cheatsheet
- [x] `.env.example` for api + web

---

### ✅ Stage 14 — Deploy beta

- [x] Vercel — `apps/web` → https://gig-tax-canada-web.vercel.app (later custom domain)
- [x] Oracle Cloud Always Free VM — Nest API via pm2 (`gigtax-api`)
- [x] Neon Postgres (production `DATABASE_URL`)
- [x] Cloudflare quick tunnel → public HTTPS to `127.0.0.1:4000` (URL changes on restart) — superseded
- [x] Named tunnel connector (`cloudflared` systemd) installed
- [x] Production env: `WEB_ORIGIN` + Vercel `NEXT_PUBLIC_API_URL`
- [x] Smoke test: login, summary, trips, CSV export on production
- [x] Dashboard trust polish: honest deductible label; `platformKmGap` + reconciliation card (`d344087`)

**Prod URLs (2026-07-28):**
- Web: https://gigtaxcanada.com
- API: https://api.gigtaxcanada.com → Oracle `127.0.0.1:4000` (Cloudflare named tunnel)
- Ensure API `.env`: `WEB_ORIGIN=https://gigtaxcanada.com`
- Ensure Vercel: `NEXT_PUBLIC_API_URL=https://api.gigtaxcanada.com`

**Prod ops (Oracle):** `~/GigTaxCanada` · `pm2` (`gigtax-api`, cloudflared named tunnel) · SSH `ubuntu@152.67.248.243`

**Prod API deploy (after `git pull`):** always regenerate Prisma before `nest build` when schema changed:

```bash
cd ~/GigTaxCanada && git pull
cd apps/api
npx prisma db push          # Neon prod DATABASE_URL in .env
npx prisma generate
npm run build
pm2 restart gigtax-api
```

---

### ✅ Stage 15 — Odometer readings + simplified personal km

- [x] Prisma `OdometerReading` (`userId` + `date` unique)
- [x] `GET/POST/DELETE /odometer-readings`
- [x] Summary: if ≥2 readings in tax year → `totalKm = latest − earliest`, `personalKm = max(0, totalKm − businessKm)`; else fallback to `PERSONAL` trips
- [x] `warnUnrealisticBusinessUse` when ~100% business / 0 personal
- [x] Shared fields: `odometerTotalKm`, `usedOdometer`, `warnUnrealisticBusinessUse`
- [x] Web `/odometer` + AppNav + dashboard personal/total km + odometer card
- [x] Unit tests: `summary.service.spec.ts`, `odometer-readings.service.spec.ts`

**Verified:** Dashboard amber warning at 100% business; after 2 odometer readings → personal km recalculated, warning clears, sky “odometer-based” card.

---

### ✅ Stage 16 — Km UX: double-count guard, edit, period batch, platform hints

- [x] `warnPossibleDoubleCount` when platform import + same-platform BUSINESS trips (formula unchanged)
- [x] Dashboard red warning + links to Trips / Platform km
- [x] Web Edit for Trips, Expenses, Odometer (PATCH / upsert)
- [x] Shared `PLATFORM_HAS_ANNUAL_KM` + `PLATFORM_KM_HINT` on Import / Trips
- [x] Trips **Period batch** (any date range → one BUSINESS trip + note range)
- [x] Dashboard gap card: “Manual business beyond platform statements”
- [x] Unit tests for double-count true/false paths

**Verified:** Uber import + Uber trip → red warning; trip platform → NONE clears warning; Instacart hints; period batch creates one trip with range note.

---

## Upcoming stages

### ✅ Stage 17a — Custom domain + stable API (done)

- [x] Domain `gigtaxcanada.com` on web
- [x] Stable API `api.gigtaxcanada.com` (Cloudflare named tunnel → Oracle Nest)
- [x] Prod smoke on custom domain (odometer summary visible)

### ⬜ Stage 17b — Distribution (pre-scale)

- [ ] Landing / waitlist or 3 SEO pages (Uber Eats T2125 Canada, etc.)
- [ ] 5 beta users from driver communities
- [ ] One-paragraph positioning vs RideWiz finalized

---

## Backlog (from PLAN.md — post-validation)

| Item | Priority |
|------|----------|
| Tax year selector in UI | Medium |
| Optional CRA per-km allowance estimate (comparison only, not tax advice) | Low / after MVP |
| Google OAuth | Low |
| Stripe / tax-season pass pricing | After 5–10 users |
| Accountant client portal (`AccountantClient` model) | Later |
| PDF reports, bank links, AI categorization | Defer |
| Quebec / French | Later |

---

## API modules (current)

| Module | Routes | Status |
|--------|--------|--------|
| Auth | `/auth/*` | ✅ |
| Trips | `/trips` | ✅ |
| Expenses | `/expenses` | ✅ |
| Summary | `/summary`, `/summary/export` | ✅ |
| Platform imports | `/platform-imports` | ✅ |
| Odometer readings | `/odometer-readings` | ✅ |
| Health | `/health` | ✅ |

---

## Local dev cheat sheet

```bash
# DB
docker compose up -d
cd apps/api && npx prisma db push && npx prisma generate

# API :4000
cd apps/api && npm run start:dev

# Web :3000
cd apps/web && npm run dev

# Token
export TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@test.com","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

# Odometer (optional — enables personal km = total − business)
curl -s -X POST http://localhost:4000/odometer-readings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"date":"2026-01-01","reading":10000}'
curl -s -X POST http://localhost:4000/odometer-readings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"date":"2026-12-31","reading":20000}'
```

---

## Changelog

| Date | Stage | Summary |
|------|-------|---------|
| 2026-05-19 | 1–5 | Monorepo, shared, Next, Nest, Postgres/Prisma |
| 2026-05-19 | 6–10 | Auth, trips, expenses, summary, platform imports (API) |
| 2026-05-19 | 11 | Web login + dashboard; full-height UI polish |
| 2026-05-20 | 12–13 | Web CRUD pages, AppNav, PWA manifest, env examples, root README |
| 2026-05-21 | 14 | Neon + Oracle API + Cloudflare tunnel + Vercel web; prod smoke |
| 2026-07-27 | 14+ | Dashboard: expense×% label, `platformKmGap` card; prod redeploy verified |
| 2026-07-28 | 15 | Odometer readings; personal km = odometer total − business; warn at 100% business |
| 2026-07-28 | 16 | Double-count warning; Edit CRUD; platform hints; period batch; gap-label copy |
| 2026-07-28 | 17a | Custom domain gigtaxcanada.com + stable api.gigtaxcanada.com |

---

## Related docs

- [PLAN.md](./PLAN.md) — product strategy, MVP scope, GTM, architecture rationale
