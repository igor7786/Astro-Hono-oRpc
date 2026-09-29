# Astro-Hono-oRPC Full-Stack Application

Server-rendered Astro application running on Bun. The stack includes Hono, oRPC, React islands, Tailwind CSS, Base UI/shadcn components, TanStack Query, Nanostores, Drizzle ORM, and Boneyard.

## Quick start

### Prerequisites

- Bun `1.4.x` (`bun@1.4.2` is pinned by the repository)

### Install and run

```bash
bun install
cp .example.env .env
# Set the required values in .env.
bun run generate:contract
bun run bun:dev
```

The development server listens on `http://localhost:4322`.

Environment values are validated at runtime by `src/lib/env/server.env.ts` and `src/lib/env/client.env.ts`. The schemas are the source of truth for required variables; `.example.env` provides the variable names. Only `PUBLIC_` variables are exposed to browser code.

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Astro using the default environment |
| `bun run build` | Build the Astro server output |
| `bun run preview` | Preview the Astro build |
| `bun run astro` | Run the Astro CLI |
| `bun run bun:dev` | Start Astro with Bun and `.env` loaded |
| `bun run bun:build` | Build the server output with Bun and `.env` loaded |
| `bun run bun:preview` | Run the built Bun server on port `4322` |
| `bun run ts:check` | Run Astro and TypeScript checks |
| `bun run format` | Format source and documentation files with Prettier |
| `bun run knip` | Find unused exports and imports |
| `bun run knip:fix` | Remove unused exports and imports using Knip |
| `bun run generate:contract` | Generate `src/server/contracts/helpers/contract.json` |
| `bun run env:test` | Check environment loading |
| `bun run og:test` | Exercise OG image generation |
| `bun run husky:init` | Initialize Husky hooks |
| `bun run prepare` | Install Husky hooks; runs during package installation |

Infrastructure checks:

```text
bun run redis:vps:test
bun run rustfs:vps:test
bun run neon:test
bun run pg:vps:test
bun run sqlite:test
bun run redpanda:vps:test
bun run tinybird:vps:test
```

Tinybird commands:

```text
bun run tinybird:dev
bun run tinybird:build
bun run tinybird:deploy
bun run tinybird:preview
```

## Database commands

Choose `sqlite`, `neon`, or `pg`:

```bash
bun run db:sqlite:generate
bun run db:sqlite:migrate
bun run db:sqlite:studio
```

The same `generate`, `migrate`, and `studio` commands are available for Neon and VPS PostgreSQL:

```text
bun run db:neon:generate
bun run db:neon:migrate
bun run db:neon:studio
bun run db:pg:generate
bun run db:pg:migrate
bun run db:pg:studio
```

## Project structure

```text
├── public/                         # Static assets
├── src/
│   ├── assets/                     # Imported assets
│   ├── bones/                      # Generated Boneyard registry and assets
│   ├── components/
│   │   ├── astrocomp/              # Astro components
│   │   └── reactcomp/              # Hydrated React islands and UI
│   ├── layouts/                    # Astro layouts
│   ├── pages/                      # Astro routes, auth pages, and playground pages
│   ├── styles/                     # Global Tailwind CSS
│   ├── lib/                        # Environment, database, clients, state, and helpers
│   ├── plugins/                    # Astro startup and CSP integrations
│   └── server/
│       ├── app.ts                  # Hono app mounted at /api
│       ├── clients/                # Typed web client
│       ├── contracts/              # oRPC contracts and generated artifact
│       ├── handlers/               # RPC and OpenAPI handlers
│       ├── hono-middleware/        # Hono middleware and dispatch
│       ├── procedures/             # Base typed procedures
│       ├── routers/                # oRPC implementations
│       ├── schemas/                # Zod request and response schemas
│       └── seo/og/                 # OG image generation and caching
├── astro.config.mjs                # Astro, Bun, React, Tailwind, and aliases
├── components.json                 # shadcn configuration
├── package.json
└── tsconfig.json
```

## Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime and web | Astro 7.3 + Bun adapter + Hono 4.13 | SSR application and HTTP middleware |
| UI | React 19.3 + Tailwind CSS 4.2 + Base UI | Selectively hydrated islands and UI components |
| API | oRPC 1.15 + OpenAPI | Contract-first typed RPC and HTTP API |
| State and data fetching | Nanostores + TanStack Query 5.104 | Client state and server cache |
| Validation | Zod 4.6 | Environment, request, and response schemas |
| Persistence | Drizzle ORM | SQLite, Neon PostgreSQL, and VPS PostgreSQL |
| Infrastructure | Redis, Redpanda/Kafka, RustFS, Tinybird | Cache, events, object storage, and analytics |
| API documentation | Scalar | Interactive OpenAPI documentation |

Important implementation choices:

- Astro renders the application and hydrates React only where needed.
- Contracts in `src/server/contracts/` are registered in `all.contracts.ts` and implemented by routers in `src/server/routers/`.
- The Hono app injects SQLite, PostgreSQL, Neon, Redis, RustFS, Kafka, and geo clients into request context before RPC/OpenAPI dispatch.
- The browser client uses the OpenAPI transport at `/api/openapi/v1`; the RPC transport remains available at `/api/rpc`.
- Astro and Hono apply origin checks, CORS/CSRF protection, CSP, security headers, ETags, request logging, and method handling.
- `src/plugins/clients.ts` initializes infrastructure clients and closes them during process shutdown.

The `/auth/login` and `/auth/register` pages currently provide validated form UI. Backend authentication and session handling are documented as future implementation work in `AUTH_IMPLEMENTATION.md`.

## API

All Hono API routes are under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Basic Hono status response |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/docs` | Combined Scalar documentation |
| `GET` | `/api/openapi/v1/orpc-docs` | Scalar documentation for the oRPC OpenAPI handler |
| `GET` | `/api/openapi/v1/generate-schema` | Generated OpenAPI JSON schema |
| `*` | `/api/rpc/*` | oRPC procedure transport |
| `*` | `/api/openapi/v1/*` | OpenAPI procedure transport |

### Registered procedures

| Method | Endpoint | Procedure |
|--------|----------|-----------|
| `GET` | `/api/openapi/v1/tests/test` | `tests.test` |
| `POST` | `/api/openapi/v1/tests/slow-test` | `tests.slowTest` |
| `GET` | `/api/openapi/v1/tests/clients` | `tests.testClients` (SSE infrastructure check) |
| `GET` | `/api/openapi/v1/tests/redirects` | `tests.redirectTest` |
| `GET` | `/api/openapi/v1/seo/og` | `seo.og` |
| `GET` | `/api/openapi/v1/seo/llms.html` | `seo.llmsHtml` |
| `GET` | `/api/openapi/v1/seo/llms.txt` | `seo.llmsTxt` |
| `POST` | `/api/openapi/v1/csp-report` | `csp.cspReport` |
| `GET` | `/api/openapi/v1/geo` | `geo.geoContract` |

The same procedures are available through the `/api/rpc` transport. Procedure routes and schemas are defined in `src/server/contracts/` and `src/server/schemas/`.

## Hono middleware order

`src/server/app.ts` applies middleware in this order:

1. Base `/api` routing and CSP nonce setup
2. Scalar documentation route
3. Trailing-slash normalization
4. Infrastructure client injection
5. HEAD handling
6. `Vary` header hardening
7. CORS
8. CSRF protection
9. Request logging
10. ETag handling
11. oRPC and OpenAPI dispatch
12. Health check and allowed-method handling

## Add an oRPC procedure

1. Add input/output schemas under `src/server/schemas/`.
2. Define the contract under `src/server/contracts/` using `baseOc`.
3. Register it in `src/server/contracts/all.contracts.ts`.
4. Implement the router under `src/server/routers/` using `base`.
5. Register it in `src/server/routers/all.routers.ts`.
6. Regenerate the contract artifact:

   ```bash
   bun run generate:contract
   ```

7. Call it through the typed client in `src/server/clients/web.client.ts`.

## OG images and SEO documents

The SEO router provides:

- `seo.og` for validated, HMAC-protected OG image IDs
- `seo.llmsHtml` for generated HTML documentation
- `seo.llmsTxt` for generated plain-text documentation

OG images use Neon metadata and can use Redis/RustFS caching. Do not construct unsigned production OG ID tokens; use the validation defined by `ogIdTokenSchema`.

## Security

- Astro `checkOrigin` protects server-rendered requests.
- CSP is applied to production Astro HTML and Hono HTML responses.
- CSP reports are accepted at `POST /api/openapi/v1/csp-report`.
- Security headers include Permissions-Policy, Referrer-Policy, X-Frame-Options, and X-Content-Type-Options.
- CORS, CSRF, allowed methods, ETags, and request logging are handled in the Hono middleware stack.
- Dynamic HTML responses use `no-store`; API responses bypass Astro page-error redirects.

## Path aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@rcomp/*` | `./src/components/reactcomp/*` |
| `@acomp/*` | `./src/components/astrocomp/*` |

## License

MIT
