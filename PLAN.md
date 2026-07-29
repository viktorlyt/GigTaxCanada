# GigTax Canada — Analysis and Recommendations

Canada-first, T2125-oriented tooling for gig workers, built as **web/PWA first** with **Next.js + NestJS + PostgreSQL + Prisma**, **1–2 hours/day**, aiming for **semi-passive income**.

---

## What the conversation got right

| Decision | Why it holds up |
|----------|----------------|
| Niche = Canadian gig tax | CRA motor-vehicle rules are stricter than US “standard mileage rate”; US apps optimize for the wrong workflow |
| Web + mobile-friendly PWA for v1 | Matches your time budget and skills; avoids App Store delay |
| Narrow MVP (trips, expenses, dashboard, export) | Correct instinct — shipping beats AI/bank sync |
| NestJS + Prisma + Postgres | Fine for a growing API; structure helps when you add subscriptions and reports |
| Monorepo (Turborepo) | Worth it if you share DTOs/types between `apps/web` and `apps/api` |
| Next.js over Vue | Right call given time constraint and SEO for “uber eats taxes canada”-style queries |

---

## Critical reality check: RideWiz

[RideWiz](https://www.ridewiz.ca/) is **Canada-specific**, markets **T2125**, has **native iOS/Android**, and emphasizes **automatic mileage**. Competing head-on with “we also track km” without GPS auto-tracking is the weakest path.

**Recommended wedge (pick one for MVP messaging):**

1. **Multi-platform reconciliation (best fit for your Uber insight)**  
   Tagline idea: *“Uber gave you annual km — we help you add the rest.”*  
   Target: drivers on **Uber + DoorDash/Instacart**, mixed personal/business days, km to first pickup / gas runs / car wash.  
   RideWiz auto-track may still miss context; your product wins on **clarity + control + platform-specific import**, not on background GPS.

2. **Expense + business-use % worksheet (second-best)**  
   Many drivers obsess over mileage apps but **fail on annual gas/insurance/repairs** and the **business-use %** formula. MVP dashboard centers: total km, business km, % → applied to expense categories (CRA motor vehicle logic).

3. **Undercut RideWiz on price/UX** — only if you can match **trust** (audit trail, export quality). Harder as solo founder without auto-track.

**Recommendation:** Lead with **(1) multi-platform reconciliation + (2) expense worksheet**. De-emphasize “automatic tracker”; emphasize **“complete the km Uber didn’t count”** and **“Chart A numbers in one place.”**

---

## MVP scope — tighten before Day 1

### Keep (core loop)

- Auth (email + Google optional later)
- **Trips:** date, km, purpose (business/personal), platform, optional note
- **Expenses:** date, amount, category (fuel, insurance, maintenance, wash, other)
- **Dashboard (tax year):** total km, business km, business %, expenses by category, deductible portion = expense × business %
- **Export:** CSV + printable summary (not “file your taxes”)

### Add (small effort, high trust)

- **Tax year selector** (default current calendar year)
- **Odometer readings** (done): arbitrary dated readings; with ≥2 in a tax year, personal km = (latest − earliest) − business km (CRA-friendly simplified personal tracking)
- **“Import platform km”** — Uber/DoorDash year-end statement km + Trips for gap only; Instacart usually has no annual km (log on Trips / period batch). App warns if statement + same-platform trips would double-count.
- **Disclaimer** on every export: information only, not tax advice; keep records 6 years (CRA)

### Defer (post-validation)

- Stripe / paywall until 5–10 real users try free tier
- PDF fancy reports, AI categorization, bank links, CCA calculator, accountant portal
- Native app (only if retention proves manual logging works)

### Avoid in marketing copy

- “Auto audit-proof” / “files T2125 for you” — use **“worksheet summary aligned with T2125 Chart A concepts”** until a CPA reviews templates

---

## Architecture recommendation

| Approach | Pros | Cons |
|----------|------|------|
| **A. Monorepo: Next + Nest + Prisma** (chosen) | Clean separation, shared types | More deploy plumbing (2 services) |
| **B. Next API routes + Prisma first, extract Nest at month 2** | Fastest first login + trip form | Refactor later |

**Chosen:** Monorepo with Turborepo.

```
gig-tax-canada/
├── apps/web/          # Next.js App Router, PWA manifest
├── apps/api/          # NestJS modules: auth, trips, expenses, summary, platform-imports, odometer-readings
├── packages/shared/   # enums + TaxYearSummary types
└── apps/api/prisma/   # schema + PrismaModule
```

**Auth:** JWT access; Next stores token in `localStorage`, calls API via `NEXT_PUBLIC_API_URL`.  
**Deploy:** Vercel (web) + Railway or Render (api + Postgres).  
**PIPEDA:** privacy policy + minimal PII; no selling data.

---

## Realistic timeline (1–2 h/day)

| Week | Outcome |
|------|---------|
| 0 (before code) | 3–5 Reddit/Facebook reads + 2 sentence value prop + landing waitlist |
| 1 | Monorepo, DB schema, auth, one trip CRUD |
| 2 | Expenses + dashboard math |
| 3 | Export + mobile PWA polish |
| 4 | Deploy + 5 beta users from communities |

Passive income starts after **distribution**, not after deploy.

---

## Go-to-market (biggest risk)

**Low-effort, high-signal channels:**

1. **Seasonal SEO** — publish 3–5 short pages (EN; FR if you can): “Uber Eats T2125 Canada”, “business use percentage vehicle”, “DoorDash taxes Canada”. Next.js SSR helps here.
2. **Reddit/Facebook (authentic, not spam)** — answer threads with checklist; link tool only when relevant. Subs: r/UberEATS, r/doordash_drivers, Canadian driver FB groups.
3. **Tax season burst** — Jan–Apr is when pain peaks; launch beta by January latest for 2026 filing season.
4. **Accountant micro-partners** — one local CPA offering gig clients a 10% referral; they care about clean km logs.

**Pricing (revise slightly):**

- Free: 30 trips/month + dashboard (generous enough to hook)
- **$49–79/year** “tax season pass” may convert better than $8/mo for seasonal users
- Monthly $9 optional for year-round multi-app drivers

---

## Validation checklist (do this before heavy coding)

1. Read 20 recent posts in driver communities — tag pains: mileage, expenses, T2125, platforms, accountants.
2. Sign up for RideWiz free trial — note what it does well and what feels wrong for **your** workflow.
3. Write one paragraph: *“For Canadian drivers who ___, GigTax is ___ unlike RideWiz because ___.”*
4. Optional: 5 DMs to drivers you know — “would you pay $60/year for X?”

---

## Legal / product hygiene

- Terms + Privacy (PIPEDA): what you store, retention, deletion
- Not a tax preparer — clear disclaimer
- Export is **user’s responsibility** to verify with CRA guides or CPA
- Consider **Quebec/French** later if you scale nationally

---

## Suggested first-week execution order

1. Initialize Turborepo + Prisma schema (`User`, `Trip`, `Expense`, tax year on records)
2. Nest: `auth`, `trips`, `expenses`, `summary` (business % + deductible expenses)
3. Next: register/login, trip form (mobile-first), dashboard cards
4. `manifest.json` + installable PWA basics
5. README with local dev commands

---

## Bottom line

The idea is **viable** and your personal experience is a real moat — but **success depends on positioning against RideWiz**, not on beating US mileage apps. Build for **multi-platform km gaps + expense business-use %**, ship a **trustworthy worksheet export**, and invest early in **tax-season distribution**. Keep the stack you chose; **narrow the promise** and **extend the timeline** to match 1–2 hours per day.
