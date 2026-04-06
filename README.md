# Astro-Hono-oRPC Full-Stack Application

A modern full-stack web application combining **Astro** for frontend rendering with **Hono** and **oRPC** for type-safe API development, featuring **TanStack Query** with SSR support, **IndexedDB persistence**, **contract-first API design**, **authentication with Better Auth**, and **security with Arcjet**.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.12.0
- **Bun** (recommended package manager and runtime)

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

The dev server runs at `http://localhost:4321`.

### Environment Variables

Copy `.example.env` to `.env` and fill in the required values:

```bash
cp .example.env .env
```

#### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_URL` | Database connection string (NeonDB/PostgreSQL) |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session encryption |
| `BETTER_AUTH_URL` | Base URL for Better Auth (e.g., `http://localhost:4321`) |
| `PUBLIC_URL` | Public-facing application URL |
| `PUBLIC_API_URL` | Public API base URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `RESEND_EMAIL` | Resend API key for transactional emails |
| `UPSTASH_REDIS_URL` | Upstash Redis connection URL |
| `ARCJET_KEY` | Arcjet security API key |
| `ARCJET_ENV` | Arcjet environment (e.g., `development`, `production`) |
| `CLOUD_TOKEN` | Cloud service authentication token |
| `QWEN_API_KEY` | Qwen API key for AI features |
| `PANGOLIN_ENDPOINT` | Pangolin service endpoint |
| `NEWT_SECRET` | Newt service secret key |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`, `preview`). Defaults to `development` |

#### Environment Validation

Environment variables are validated at startup using Zod schemas:

- **Server-side** (`src/lib/env/server.env.ts`) - Validates all server environment variables
- **Client-side** (`src/lib/env/client.env.ts`) - Exposes only `PUBLIC_*` variables to the browser

```typescript
// Usage
import { envServer } from '@/lib/env/server.env';
import { envClient } from '@/lib/env/client.env';

console.log(envServer.DB_URL);
console.log(envClient.PUBLIC_URL);
```

### Production Build

```bash
# Build for production
bun build

# Preview production build locally
bun preview
```

Production builds output to `./dist/` and run as a Node.js standalone server.

---

## 📁 Project Structure

```
/home/igor7786/MyProjects/Astro-Hono-oRpc/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── astrocomp/          # Astro-native UI components (SSR, no hydration)
│   │   │   └── Welcome.astro
│   │   └── reactcomp/          # React components (islands architecture)
│   │       ├── lib/
│   │       │   └── utils.ts    # Utility functions (cn helper for classnames)
│   │       ├── ui/
│   │       │   └── button.tsx  # shadcn/ui components
│   │       ├── SlowRequest.tsx # Demo component for request cancellation
│   │       ├── TestClient.tsx  # Example React island component
│   │       └── TestTanstackQuery.tsx  # TanStack Query integration example
│   ├── layouts/
│   │   └── Layout.astro        # Main layout with theme support (dark/light)
│   ├── lib/
│   │   ├── env/                  # Environment variable validation
│   │   │   ├── client.env.ts       # Client-side env (PUBLIC_* vars only)
│   │   │   └── server.env.ts       # Server-side env (all vars with Zod validation)
│   │   ├── server/             # Server-side oRPC/Hono code
│   │   │   ├── app.ts          # Hono app configuration with CORS & middleware
│   │   │   ├── contracts/
│   │   │   │   ├── all.contracts.ts  # Contract aggregator
│   │   │   │   ├── oc.base.ts        # Base oRPC contract with error definitions
│   │   │   │   └── test.contract.ts  # Example contract definition
│   │   │   ├── handlers/
│   │   │   │   ├── openapi.handler.ts  # OpenAPI schema generation handler
│   │   │   │   └── rpc.handler.ts      # oRPC procedure handler
│   │   │   ├── middlewares/
│   │   │   │   └── validation-errors.ts  # oRPC validation error handler
│   │   │   ├── procedures/
│   │   │   │   └── base.ts     # Base oRPC procedure with error definitions
│   │   │   ├── routers/
│   │   │   │   ├── all.routers.ts  # Router aggregator
│   │   │   │   └── test.ts     # Example oRPC router
│   │   │   ├── schemas/
│   │   │   │   └── test.schema.ts  # Zod validation schemas
│   │   │   ├── server.client.ts    # Server-side oRPC client
│   │   │   └── web.client.ts       # Browser oRPC client
│   │   ├── stores/
│   │   │   └── ssr.ts          # Nanostores for SSR state management
│   │   └── tanstack-query/     # TanStack Query configuration
│   │       ├── browserClient.ts    # Browser client with IndexedDB persistence
│   │       ├── mainQuery.ts        # Query client factory
│   │       ├── query.ts            # Server-side query client
│   │       ├── QueryDevTools.tsx   # TanStack Query DevTools component
│   │       └── SsrQueryProvider.tsx  # SSR hydration provider
│   ├── pages/
│   │   ├── api/
│   │   │   └── [...path].ts    # Hono API catch-all route
│   │   └── index.astro         # Home page with SSR data fetching
│   ├── scripts/
│   │   └── theme-checker.js    # Dark mode detection script
│   └── styles/
│       └── global.css          # Tailwind CSS + shadcn/ui styles
├── astro.config.mjs            # Astro configuration (SSR, Node adapter)
├── components.json             # shadcn/ui configuration
├── package.json
├── tsconfig.json               # TypeScript configuration with path aliases
└── .prettierrc.mjs             # Prettier configuration
```

---

## 🏗️ Architecture

### Hybrid Architecture

The application follows a **hybrid architecture**:

- **Static/SSR pages** served by Astro
- **API routes** handled by Hono with oRPC for type-safe RPC calls
- **Islands architecture** - React components are hydrated selectively using `client:load`
- **SSR with TanStack Query** - Server-side data fetching with client hydration

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Astro v6 | Server-side rendering, static generation |
| **UI Framework** | React v19 + base-ui | Interactive islands (hydrated components) |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with pre-built components |
| **API** | Hono v4 | Lightweight web framework for API routes |
| **RPC** | oRPC v1.13 | Type-safe RPC with OpenAPI support |
| **State** | Nanostores + TanStack Query | Client-side state management |
| **Query Cache** | IndexedDB (idb-keyval) | Persistent query cache with SuperJSON serialization |
| **Validation** | Zod v4 | Schema validation for inputs/outputs and environment variables |
| **API Docs** | Scalar | Interactive OpenAPI documentation |
| **Authentication** | Better Auth | Session management with OAuth (Google, GitHub) |
| **Security** | Arcjet | Rate limiting and bot protection |
| **Email** | Resend | Transactional email service |
| **Cache** | Upstash Redis | Distributed caching layer |
| **AI** | Qwen API | AI-powered features |
| **Runtime** | Node.js >= 22.12.0 | Server runtime |
| **Package Manager** | Bun | Fast package manager and runtime |

---

## 🔌 API Endpoints

All API routes are prefixed with `/api/` and served through Hono.

### Base URL

- **Development:** `http://localhost:4321/api`
- **Production:** `https://your-domain.com/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/docs` | Scalar API documentation |
| `POST` | `/api/rpc/*` | oRPC procedure calls |
| `GET` | `/api/rpc/generate-schema` | OpenAPI schema for oRPC |

### Health Check

**GET `/api/health`**

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok"
}
```

---

### oRPC Procedures

#### GET `/api/rpc/test`

Test procedure demonstrating oRPC setup.

**Description:** Test route for verifying oRPC configuration.

**Input Schema:**
```typescript
{
  name: string  // 3-40 characters
}
```

**Output Schema:**
```typescript
{
  name: string
}
```

**Example Request:**
```typescript
import { client } from '@/lib/server/web.client';

const result = await client.test({ name: 'World' });
// Returns: { name: 'Hello, World!' }
```

**Errors:**

| Status | Code | Reason |
|--------|------|--------|
| 403 | `FORBIDDEN` | If name is "admin" |
| 422 | `INPUT_VALIDATION_FAILED` | Invalid input schema |

---

## 🎯 TanStack Query Integration

### Features

- **SSR Support** - Server-side data fetching with hydration
- **IndexedDB Persistence** - Query cache persists across sessions (24h TTL)
- **SuperJSON Serialization** - Preserves dates, Maps, Sets, and other complex types
- **Request Cancellation** - AbortController integration for slow requests
- **Query Prefetching** - Optimistic data loading on hover

### Architecture

The TanStack Query setup consists of:

1. **Query Client Factory** (`mainQuery.ts`) - Creates configured QueryClient instances
2. **Server Client** (`query.ts`) - Server-side query client for SSR
3. **Browser Client** (`browserClient.ts`) - Browser client with IndexedDB persistence
4. **SSR Provider** (`SsrQueryProvider.tsx`) - Hydration boundary component
5. **Query DevTools** (`QueryDevTools.tsx`) - Development debugging tools

### Usage Example

```typescript
// Server-side data fetching (index.astro)
import { serverClient } from '@server/server.client';

const data = await serverClient.test({ name: 'from SSR' });

// Client-side with TanStack Query (TestTanstackQuery.tsx)
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/browserClient';
import { clientOrpc as orpc } from '@server/web.client';

const { data, isLoading, error } = useQuery(
  orpc.test.queryOptions({
    input: { name: 'test' },
    queryKey: ['test', { name: 'test' }],
  }),
  client
);
```

### Request Cancellation Example

The `SlowRequest.tsx` component demonstrates:
- Query cancellation on user action
- Query prefetching on hover
- Automatic cleanup of cancelled queries

```typescript
const handleCancel = () => {
  client.cancelQueries({ queryKey: ['slow-test'] });
};

const handleMouseEnter = () => {
  client.prefetchQuery(
    orpc.testSlow.queryOptions({
      input: { name: 'slow operation' },
      queryKey: ['slow-test', fetchId],
    })
  );
};
```

---

## 📝 Contract-First API Design

oRPC supports a contract-first approach where API contracts are defined separately from implementations, enabling better type safety and client generation.

### Architecture

Contracts are defined in `src/lib/server/contracts/`:

1. **Base Contract** (`oc.base.ts`) - Defines shared error schema for all procedures
2. **Contract Definitions** (`*.contract.ts`) - Individual contract definitions with routes, inputs, outputs
3. **Contract Aggregator** (`all.contracts.ts`) - Exports all contracts as a single typed object

### Usage Example

**Define a contract:**

```typescript
// src/lib/server/contracts/my.contract.ts
import { baseOc } from '@/lib/server/contracts/oc.base';
import { mySchema } from '@server/schemas/my.schema';

export const myContract = baseOc
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Description of the endpoint',
    summary: 'Short summary',
    tags: ['MyTag'],
    successDescription: 'Success response',
    successStatus: 200,
  })
  .input(mySchema)
  .output(mySchema);
```

**Export in aggregator:**

```typescript
// src/lib/server/contracts/all.contracts.ts
import { myContract } from '@server/contracts/my.contract';

export const appContract = {
  my: myContract,
};

export type AppContract = typeof appContract;
```

### Benefits

- **Type-safe clients** - Full TypeScript inference from contracts
- **OpenAPI generation** - Contracts automatically generate OpenAPI schemas
- **Error consistency** - Shared error definitions across all procedures
- **Decoupled design** - Contracts separate from implementation

---

## 🔐 Environment Variable Management

### Server-Side Validation

All server environment variables are validated at startup using Zod. The app will fail fast if required variables are missing.

```typescript
// src/lib/env/server.env.ts
import { envServer } from '@/lib/env/server.env';

// Type-safe access to environment variables
const dbUrl = envServer.DB_URL;
const authSecret = envServer.BETTER_AUTH_SECRET;
```

### Client-Side Exposure

Only `PUBLIC_*` prefixed variables are exposed to the browser for security.

```typescript
// src/lib/env/client.env.ts
import { envClient } from '@/lib/env/client.env';

// Safe for browser use
const apiUrl = envClient.PUBLIC_API_URL;
```

### Adding New Environment Variables

1. Add the variable to `.example.env`
2. Add validation schema in `src/lib/env/server.env.ts` (for server vars)
3. Add to `src/lib/env/client.env.ts` (for `PUBLIC_*` client vars only)

---

## 🛠️ Configuration

### Path Aliases (tsconfig.json)

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@rcomp/*` | `./src/components/reactcomp/*` |
| `@acomp/*` | `./src/components/astrocomp/*` |
| `@server/*` | `./src/lib/server/*` |

### Astro Configuration (astro.config.mjs)

- **Output mode:** `server` (SSR)
- **Adapter:** `@astrojs/node` (standalone mode)
- **React integration:** Enabled with `client:load` hydration

### TypeScript Configuration

- **Strict mode:** Enabled
- **JSX:** `react-jsx`
- **Module resolution:** `bundler`
- **Path aliases:** Configured for clean imports

### Prettier Configuration

- **Line length:** 105 characters
- **Quotes:** Single quotes
- **Semicolons:** Required
- **Trailing commas:** ES5 style
- **Plugins:** astro, classnames, tailwindcss, merge

---

## 🎨 Styling & Theming

### Tailwind CSS v4

Uses Tailwind CSS v4 with Vite integration. No separate `tailwind.config.js` required.

### shadcn/ui (base-vega style)

Pre-built UI components following the base-vega design system.

**Configuration (`components.json`):**
- Style: `base-vega`
- Icon library: Lucide
- CSS variables: Enabled
- Base color: Neutral

### Dark/Light Theme

Automatic theme detection via `src/scripts/theme-checker.js`.

**CSS Variables:**
- Defined in `src/styles/global.css`
- Uses OKLCH color space for better perceptual uniformity
- Sidebar, chart, and semantic color tokens included

**Usage:**
```astro
---
import Layout from '@/layouts/Layout.astro';
---
<Layout title="My Page">
  <div slot="main">Content</div>
</Layout>
```

---

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun dev` | Start development server at `localhost:4321` |
| `bun build` | Build production site to `./dist/` |
| `bun preview` | Preview production build locally |
| `bun astro ...` | Run Astro CLI commands (e.g., `astro add`, `astro check`) |
| `bun ts:check` | Type check with TypeScript (no emit) |
| `bun format` | Format code with Prettier |

---

## 🔧 Development Guidelines

### Code Style

- **Explicit over implicit** — Always define types and imports clearly
- **No magic** — Avoid clever one-liners; prefer readable logic
- **Named exports** — Use named exports over default exports
- **Comments on intent** — Document _what_ and _why_, not _how_

### Component Patterns

#### Astro Components (`.astro`)

- Located in `src/components/astrocomp/`
- Use `@acomp/` alias
- Server-rendered by default (no hydration)
- Define `Props` interface for typed props

```astro
---
interface Props {
  title: string;
}
const { title }: Props = Astro.props;
---
<h1>{title}</h1>
```

#### React Components (`.tsx`)

- Located in `src/components/reactcomp/`
- Use `@rcomp/` alias
- Must use hydration directive (`client:load`, `client:visible`, etc.)
- shadcn/ui components follow base-vega style

```tsx
'use client';
import { Button } from '@rcomp/ui/button';

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

### oRPC Patterns

**Procedure Definition:**

```typescript
import { base } from '@server/procedures/base';
import { z } from 'zod';

export const myProcedure = base
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Description of the endpoint',
    tags: ['Tag'],
  })
  .input(z.object({ param: z.string() }))
  .output(z.object({ result: z.string() }))
  .handler(async ({ input, context, errors }) => {
    // Handler logic
    return { result: 'Success' };
  });
```

**Adding New oRPC Procedures:**

1. Create a schema in `src/lib/server/schemas/`
2. Create a router in `src/lib/server/routers/` using `base` procedure
3. Export the router in `src/lib/server/routers/all.routers.ts`
4. Call from client using `client` from `@/lib/server/web.client`

### TanStack Query Patterns

**Server-Side Data Fetching (SSR):**

```typescript
// In Astro page/layout
---
import { serverClient } from '@server/server.client';

const data = await serverClient.test({ name: 'SSR' });
---
```

**Client-Side with Hydration:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/browserClient';
import { clientOrpc as orpc } from '@server/web.client';

const { data, isLoading } = useQuery(
  orpc.test.queryOptions({
    input: { name },
    queryKey: ['test', { name }],
    initialData: serverData, // SSR hydration data
  }),
  client
);
```

**Query Cancellation:**

```typescript
// Cancel running queries
client.cancelQueries({ queryKey: ['my-query'] });

// Prefetch on hover
client.prefetchQuery(
  orpc.test.queryOptions({
    input: { name: 'test' },
    queryKey: ['my-query'],
  })
);
```

### Error Handling

oRPC errors are defined in `src/lib/server/procedures/base.ts`:

| Error | Status | Message |
|-------|--------|---------|
| `BAD_REQUEST` | 400 | Bad Request |
| `UNAUTHORIZED` | 401 | You are Unauthorized |
| `FORBIDDEN` | 403 | You are Forbidden |
| `NOT_FOUND` | 404 | Not Found |
| `CONFLICT` | 409 | Resource conflict |
| `INPUT_VALIDATION_FAILED` | 422 | Input validation failed |
| `OUTPUT_VALIDATION_FAILED` | 500 | Output validation failed |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded please try again later |
| `CLIENT_CLOSED_REQUEST` | 499 | Client closed the request |
| `INTERNAL_SERVER_ERROR` | 500 | Internal Server Error |

---

## 🧪 Testing

No test framework is currently configured. Consider adding:

- **Vitest** for unit testing
- **Playwright** for E2E testing

---

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Hono Documentation](https://hono.dev)
- [oRPC Documentation](https://orpc.unno.io)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Scalar Documentation](https://scalar.com)
- [Better Auth Documentation](https://www.better-auth.com)
- [Arcjet Documentation](https://docs.arcjet.com)
- [Resend Documentation](https://resend.com/docs)
- [Upstash Documentation](https://upstash.com/docs)
- [Zod Documentation](https://zod.dev)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
