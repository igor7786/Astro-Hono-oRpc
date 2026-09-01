# Astro-Hono-oRPC Full-Stack Application

A full-stack web application combining **Astro 7** (server output with Bun adapter), **Hono 4** and **oRPC 1.14** for type-safe APIs. Built with **React 19** islands, **Tailwind CSS 4**, **shadcn/ui**, **TanStack Query 5**, **Nanostores**, **Drizzle ORM**, and **Boneyard** skeleton loading.

## Quick Start

### Prerequisites

- **Bun** >= 1.4.0

### Installation

```bash
bun install
cp .example.env .env   # then configure your values
bun run generate:contract
bun run bun:dev
```

Dev server runs at `http://localhost:4322`.

### Commands

| Command | Description |
|---------|-------------|
| `bun run bun:dev` | Start dev server (Bun runtime) |
| `bun run bun:build` | Production build |
| `bun run bun:preview` | Preview production build |
| `bun run ts:check` | TypeScript type check |
| `bun run format` | Format with Prettier |
| `bun run knip` | Find unused exports/imports |
| `bun run generate:contract` | Sync oRPC contract JSON |
| `bun run og:test` | Test OG image generation |
| `bun run env:test` | Test environment variable loading |

### Database Commands

| Command | Description |
|---------|-------------|
| `bun run db:sqlite:generate` | Generate SQLite migrations |
| `bun run db:neon:generate` | Generate Neon DB migrations |
| `bun run db:pg:generate` | Generate Postgres migrations |
| `bun run db:sqlite:migrate` | Run SQLite migrations |
| `bun run db:neon:migrate` | Run Neon DB migrations |
| `bun run db:pg:migrate` | Run Postgres migrations |
| `bun run db:sqlite:studio` | Open Drizzle Studio (SQLite) |
| `bun run db:neon:studio` | Open Drizzle Studio (Neon) |
| `bun run db:pg:studio` | Open Drizzle Studio (PG) |

### Environment Variables

Validated at startup via Zod schemas in `src/lib/env/`. Server vars are in `server.env.ts`, client-safe vars (prefixed `PUBLIC_`) in `client.env.ts`. Refer to `.example.env` for the full list.

---

## Project Structure

```
├── public/                        # Static assets (fonts, icons, robots.txt)
├── src/
│   ├── assets/                    # Images, SVGs, icon sets
│   ├── bones/                     # Boneyard skeleton definitions
│   ├── components/
│   │   ├── astrocomp/             # Astro SSR components (no hydration)
│   │   │   ├── layout/            #   FONTS, HEAD, SEO
│   │   │   └── playground/        #   Blog card demos
│   │   └── reactcomp/             # React islands (hydrated)
│   │       ├── lib/               #   Utility hooks & helpers
│   │       ├── playground/        #   Interactive demos
│   │       ├── shadcn-studio/     #   shadcn studio integration
│   │       └── ui/                #   shadcn/ui generated components
│   ├── data/                      # Markdown content (blog posts)
│   ├── layouts/                   # Page layouts
│   ├── lib/
│   │   ├── crypto/                # OG image ID/hashing utilities
│   │   ├── csp/                   # CSP hash generation & headers
│   │   ├── drizzle/               # Drizzle ORM clients & schemas
│   │   │   ├── neon/              #   NeonDB (serverless Postgres)
│   │   │   ├── pg/                #   VPS Postgres
│   │   │   └── sqlite/            #   Local SQLite
│   │   ├── env/                   # Zod-validated env configs
│   │   ├── helpers/               # Logger, paths, icons, reading-time, llms
│   │   ├── redis/                 # Redis clients (Upstash, VPS)
│   │   ├── redpanda-kafka/        # Kafka producer config
│   │   ├── s3/                    # RustFS (S3-compatible) client
│   │   ├── shared/schemas/        # Shared Zod schemas (SEO, errors)
│   │   ├── stores/                # Nanostores (online, SSR state)
│   │   ├── tanstack-query/        # Query client & devtools
│   │   ├── tinybird/              # Tinybird analytics client
│   │   └── tls/                   # mTLS client for VPS services
│   ├── pages/
│   │   ├── api/                   # (Hono catch-all is in server/app.ts)
│   │   ├── playground/            # Component testing pages
│   │   ├── error-page/            # Custom error page
│   │   └── index.astro            # Home
│   ├── plugins/                   # Astro plugins (CSP manifest, server startup)
│   ├── server/
│   │   ├── app.ts                 # Main Hono app (middleware chain + routes)
│   │   ├── clients/               # oRPC clients (server-side & web)
│   │   ├── contracts/             # oRPC contract definitions
│   │   │   ├── all.contracts.ts   #   Master contract registry
│   │   │   ├── oc.base.ts         #   Base oRPC with error types
│   │   │   ├── csp/               #   CSP report contract
│   │   │   ├── geo/               #   Geolocation contract
│   │   │   ├── seo/               #   OG, llms.txt, llms.html
│   │   │   ├── tests-contracts/   #   Test, slow test, clients, redirect
│   │   │   └── helpers/           #   Contract JSON generator
│   │   ├── handlers/              # RPC & OpenAPI request handlers
│   │   ├── hono-middleware/       # Hono middleware stack
│   │   │   ├── cors.ts            #   CORS policy
│   │   │   ├── csp.ts             #   Content-Security-Policy nonce
│   │   │   ├── csrf.ts            #   CSRF protection
│   │   │   ├── geo.ts             #   Geolocation extraction
│   │   │   ├── inject.clients.ts  #   Inject DB/Redis/Kafka into context
│   │   │   ├── orpc.ts            #   oRPC + OpenAPI dispatch
│   │   │   ├── scalar.ts          #   Scalar API docs
│   │   │   └── ...                #   head, methods, options, trailing-slash, etc.
│   │   ├── middlewares/           # oRPC middlewares (validation, error stripping)
│   │   ├── procedures/base.ts     # Base oRPC procedure with typed context
│   │   ├── routers/               # oRPC router implementations
│   │   │   ├── all.routers.ts     #   Router registry
│   │   │   ├── csp/               #   CSP violation reports
│   │   │   ├── geo/               #   Geolocation lookup
│   │   │   ├── seo/               #   OG images, llms.txt, llms.html
│   │   │   └── tests-routers/     #   Test, slow test, clients, redirect
│   │   ├── schemas/               # Zod schemas for inputs/outputs
│   │   └── seo/og/                # OG image generation (Satori + React)
│   ├── styles/                    # Global CSS (Tailwind)
│   ├── content.config.ts          # Astro content collections
│   ├── middleware.ts              # Astro middleware (security headers, cache, error redirect)
│   └── fetch.ts                   # Custom fetch for Astro SSR
├── astro.config.mjs               # Astro config (Bun adapter, React, Tailwind, fonts)
├── components.json                # shadcn/ui config (base-vega style)
├── knip.json                      # Dead code analysis config
├── tinybird.config.json           # Tinybird analytics config
├── package.json
└── tsconfig.json
```

---

## Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Astro 7 + React 19 | SSR with selective island hydration |
| Styling | Tailwind CSS 4 + shadcn/ui | Utility-first CSS, base-vega style |
| API | Hono 4 + oRPC 1.14 | Type-safe RPC + OpenAPI |
| State | Nanostores + TanStack Query 5 | Reactive state + server data fetching |
| Validation | Zod 4 | Env, API input/output schemas |
| Database | Drizzle ORM | Neon (serverless PG), VPS PG, SQLite |
| Queue | Redpanda/Kafka | Event streaming |
| Storage | RustFS (S3) | Object storage |
| Cache | Redis (Upstash / VPS) | Caching, sessions |
| Analytics | Tinybird | Real-time analytics |
| Docs | Scalar | OpenAPI reference UI |

### Key Decisions

- **Islands Architecture** — React components hydrate selectively via `client:load`
- **Contract-First API** — oRPC contracts define schemas before implementation
- **End-to-End Type Safety** — Zod validates env vars, API inputs, and outputs
- **Multi-Database** — SQLite for local dev, Neon for serverless, Postgres for VPS
- **Graceful Shutdown** — Astro plugin disconnects all clients (Redis, Kafka, PG, S3, SQLite) on SIGTERM/SIGINT

---

## API Endpoints

All routes prefixed with `/api/`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `*` | `/api/rpc/*` | oRPC procedure calls |
| `GET` | `/api/docs` | Scalar API documentation |
| `GET` | `/api/openapi/generate-schema` | Raw OpenAPI JSON spec |

### oRPC Procedures

| Procedure | Path | Description |
|-----------|------|-------------|
| `tests.test` | `/tests/test` | Connectivity test |
| `tests.slowTest` | `/tests/slow-test` | Long-running task (cancellation testing) |
| `tests.testClients` | `/tests/clients` | DB/Redis/S3 client connectivity test |
| `tests.redirectTest` | `/tests/redirect` | Redirect behavior test |
| `seo.og` | `/seo/og` | OG image generation |
| `seo.llmsHtml` | `/seo/llms.html` | LLM-friendly HTML docs |
| `seo.llmsTxt` | `/seo/llms.txt` | LLM-friendly Markdown docs |
| `csp.cspReport` | `/csp/report` | CSP violation reports |
| `geo.geoContract` | `/geo` | Client geolocation lookup |

---

## Hono Middleware Chain

The Hono app (`src/server/app.ts`) applies middleware in this order:

1. **CSP** — Content-Security-Policy nonce generation
2. **Trailing slash** — Normalization
3. **Inject clients** — Attaches SQLite, PG, Neon, Redis, Kafka, RustFS to context
4. **HEAD / OPTIONS** — Global handling
5. **CORS** — Origin policy
6. **CSRF** — Cross-site request forgery protection
7. **Pretty logger** — Request logging
8. **oRPC + OpenAPI** — RPC dispatch and OpenAPI handler

---

## Adding a New oRPC Procedure

1. **Schema** → `src/server/schemas/my.schema.ts`
2. **Contract** → `src/server/contracts/my/my.ts` (using `baseOc` from `oc.base.ts`)
3. **Register contract** → `src/server/contracts/all.contracts.ts`
4. **Router** → `src/server/routers/my/my.ts` (using `base` from `procedures/base.ts`)
5. **Register router** → `src/server/routers/all.routers.ts`
6. **Call** → `client.my.myProcedure(input)` via oRPC web client

---

## Error Types

Defined in `src/server/contracts/oc.base.ts`:

| Error | Status |
|-------|--------|
| `BAD_REQUEST` | 400 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `METHOD_NOT_SUPPORTED` | 405 |
| `CONFLICT` | 409 |
| `TOO_MANY_REQUESTS` | 429 |
| `INPUT_VALIDATION_FAILED` | 422 |
| `OUTPUT_VALIDATION_FAILED` | 500 |
| `INTERNAL_SERVER_ERROR` | 500 |
| `CLIENT_CLOSED_REQUEST` | 499 |
| `REDIRECT_REQUEST` | 403 |

---

## Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@rcomp/*` | `./src/components/reactcomp/*` |
| `@acomp/*` | `./src/components/astrocomp/*` |

---

## OG Image Generation

Social cards rendered on-the-fly via React + Satori (`src/server/seo/og/`).

- **Template**: `Generate.tsx` / `SocialCard.tsx`
- **Caching**: Redis-backed with TTL
- **Fonts**: Cached via `cache.fonts.ts`

```tsx
<meta property="og:image" content={`/api/og?title=${encodeURIComponent(title)}`} />
```

---

## Security

Astro middleware (`src/middleware.ts`) applies to every response:

- **CSP** — Production-only, hash-based for Astro-rendered HTML
- **Permissions-Policy**, **X-Content-Type-Options**, **Referrer-Policy**, **X-Frame-Options**
- **Cache-Control** — `no-store` for dynamic HTML
- **Error redirect** — Non-API error statuses redirect to `/error-page`
- **checkOrigin** — Astro's built-in CSRF protection for server output

---

## Dependencies

| Category | Packages |
|----------|----------|
| Core | `astro` 7, `react` 19, `hono` 4, `@orpc/*` 1.14, `zod` 4, `tailwindcss` 4 |
| UI | `shadcn` (base-vega), `@base-ui/react`, `lucide-react`, `sonner`, `next-themes` |
| State/Data | `nanostores`, `@tanstack/react-query` 5, `idb-keyval`, `superjson` |
| Database | `drizzle-orm`, `postgres`, `pg`, `@libsql/client` |
| Infrastructure | `ioredis`, `@platformatic/kafka`, `@aws-sdk/client-s3`, `@tinybirdco/sdk` |
| Server | `@hono/node-server`, `@wyattjoh/astro-bun-adapter`, `sharp`, `satori` |
| Docs | `@scalar/hono-api-reference`, `@scalar/openapi-to-markdown` |

---

## License

MIT
