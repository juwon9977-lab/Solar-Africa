# Solargy Africa

Nigeria's premier solar vendor directory — connecting homes and businesses with verified solar installers, panel dealers, battery suppliers, and consultants across all 37 Nigerian states.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `ADMIN_SECRET` — admin panel access key (default: `solargy-admin-2024`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS, wouter routing, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `lib/db/src/schema/` — vendors.ts, reviews.ts, blog.ts (Drizzle table definitions)
- `artifacts/api-server/src/routes/` — vendors.ts, reviews.ts, blog.ts, admin.ts, health.ts
- `artifacts/solargy-africa/src/pages/` — directory, blog, blog-post, saved, submit, admin
- `artifacts/solargy-africa/src/lib/` — constants.ts (all 37 states, categories), saved.ts (localStorage helpers)

## Architecture decisions

- Contract-first OpenAPI → Orval codegen generates React Query hooks (client) and Zod schemas (server). Never write types by hand that codegen already produces.
- Admin authentication uses the `ADMIN_SECRET` env var checked via `x-admin-key` header on all `/admin/*` routes and blog write operations.
- Vendor `logo` field stores 2-letter initials generated server-side from the vendor name; displayed as a colored circle on the frontend.
- Saved vendors are stored client-side in localStorage (`solargy_saved` key) — no auth required.
- All 37 Nigerian states + FCT are available in dropdowns. States with vendors are shown as active in the directory sidebar; others show a "(Soon)" label.

## Product

- **Directory** (`/`) — Hero with live stats, search bar, state + category sidebar filters, and vendor cards with ratings, services tags, call/save actions
- **Blog** (`/blog`, `/blog/:slug`) — Solar knowledge hub with tag filtering and full article view
- **Saved** (`/saved`) — Bookmarked vendors from localStorage
- **Submit** (`/submit`) — Vendor listing submission form with full validation
- **Admin** (`/admin`) — Password-gated admin panel to verify/feature/delete vendors and create/edit/delete blog posts

## User preferences

- No emojis in the UI
- All 37 Nigerian states available in listings
- Admin key stored in `ADMIN_SECRET` env var (not hardcoded in production)

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen` before using updated types.
- Run `pnpm run typecheck:libs` after schema changes so the DB package re-emits declarations before the API server picks them up.
- The API server must be restarted after adding new route files (it builds then runs the bundle).
- Express 5 wildcard routes require `/{*splat}` syntax, not bare `*`.
