# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server (Next.js, http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npx tsx src/lib/database.ts` — Initialize/reset the SQLite database and seed default user
- `npx tsx src/lib/seed.ts` — Add additional seed users

## Architecture

Blood pressure logging app built with **Next.js 16** (App Router), **Tailwind CSS 4**, **better-sqlite3**, and **TypeScript**.

### Routing & Pages

- `/` — Login page (`src/app/page.tsx`, client component)
- `/writer` — Blood pressure entry form with photo capture (`src/app/(default)/writer/page.tsx`)
- `/list` — Paginated record list with date filtering (`src/app/(default)/list/page.tsx`)

Pages under `(default)` route group share a layout with a top nav bar (`src/app/(default)/layout.tsx`).

### API Routes

- `POST /api/auth` — Login (username/password)
- `PUT /api/auth` — Register new user (dev use)
- `GET /api/blood?userId=&page=&limit=&startDate=&endDate=` — Fetch blood pressure records
- `POST /api/blood` — Save a blood pressure record (`{ userId, high, low, plus, measuredAt }`)

### Database

SQLite file at project root (`database.db`). Schema managed in `src/lib/database.ts`. Runtime access via singleton in `src/lib/db.ts` which exports: `getDatabase()`, `addUser()`, `authenticateUser()`, `saveBloodPressure()`, `getBloodPressureRecords()`.

Tables: `users` (id, username, password), `blood` (id, user_id, high, low, plus, measured_at, created_at).

### Auth

Simple localStorage-based auth — user object stored client-side after login. No session tokens or middleware. Pages redirect to `/` if no stored user.

### UI Language

Mixed Korean/English UI. Labels and messages are primarily in Korean; field names (High, Low, Plus) are in English.

### Key Notes

- The writer page has a photo capture feature with a placeholder OCR integration (currently returns mock data via `setTimeout`).
- Blood pressure data has three values: high (systolic), low (diastolic), plus (pulse rate).
- Writer page supports entering two measurements per save (first required, second optional).
