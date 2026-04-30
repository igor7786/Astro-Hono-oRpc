# Astro-Hono-oRPC Full-Stack Application

A modern full-stack web application combining **Astro v6** for frontend rendering with **Hono v4** and **oRPC v1.13** for type-safe API development. Built with **React 19** (islands architecture), **Tailwind CSS v4**, **shadcn/ui**, **TanStack Query v5**, **Nanostores**, and **Boneyard** skeleton loading.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.12.0
- **Bun** >= 1.2.0 (recommended package manager and runtime)

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables and configure
cp .example.env .env
# Edit .env with your values

# Generate oRPC contract JSON
bun run generate:contract

# Start development server
bun run bun:dev
```

### Other useful commands

```bash
# Type check
bun run ts:check

# Format code
bun run format

# Build for production
bun run bun:build

# Preview production build
bun run bun:preview

# Find unused exports/imports
bun run knip

# Test OG image generation
bun run og:test
```

The dev server runs at `http://localhost:4321`.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_URL` | PostgreSQL connection string (NeonDB) | ✅ |
| `UPSTASH_REDIS_URL` | Upstash Redis connection URL | ✅ |
| `BETTER_AUTH_SECRET` | Secret key for session encryption | ✅ |
| `BETTER_AUTH_URL` | Base URL (e.g., `http://localhost:4321`) | ✅ |
| `PUBLIC_URL` | Public application URL | ✅ |
| `PUBLIC_API_URL` | Public API base URL (`/api/rpc`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | ✅ |
| `RESEND_EMAIL` | Resend API key for email | ✅ |
| `ARCJET_KEY` | Arcjet security API key | ✅ |
| `ARCJET_ENV` | Arcjet environment (`development`/`production`) | ✅ |
| `CLOUD_TOKEN` | Cloud provider token | ✅ |
| `QWEN_API_KEY` | Qwen API key for AI features | ✅ |

> **Note:** Environment variables are validated at startup using Zod schemas in `src/lib/env/`.

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
├── public/                   # Static assets (fonts, icons, robots.txt)
├── src/
│   ├── assets/               # Images and static assets
│   ├── bones/                # Boneyard skeleton loading definitions
│   │   ├── *.bones.json      # Skeleton structures for components
│   │   └── registry.js       # Boneyard component registry
│   ├── components/
│   │   ├── astrocomp/        # Astro-native UI components (SSR, no hydration)
│   │   └── reactcomp/        # React components (islands architecture)
│   │       ├── lib/          # React utility hooks and helpers
│   │       ├── playground/   # Interactive component demos
│   │       ├── shadcn-studio/# shadcn studio integration
│   │       └── ui/           # shadcn/ui generated components
│   ├── data/                 # Static data (markdown content, blog posts)
│   ├── layouts/              # Page layout components
│   ├── lib/
│   │   ├── env/              # Zod-validated environment configs
│   │   │   ├── client.env.ts # Client-side environment variables
│   │   │   └── server.env.ts # Server-side environment variables
│   │   ├── helpers/          # Utilities (logger, paths, theme-checker)
│   │   ├── queues/           # Redis queue configurations
│   │   ├── shared/           # Shared schemas and types
│   │   │   └── schemas/
│   │   │       └── seo.schema.ts  # SEO-related Zod schemas
│   │   ├── stores/           # Nanostores (reactive state)
│   │   └── tanstack-query/   # TanStack Query setup and devtools
│   ├── pages/
│   │   ├── api/              # Hono API catch-all route
│   │   ├── playground/       # Component testing pages
│   │   └── index.astro       # Home page
│   ├── plugins/              # Remark/Rehype plugins for Astro markdown
│   ├── server/               # Hono and oRPC server-side logic
│   │   ├── app.ts            # Main Hono application entry point
│   │   ├── clients/          # oRPC API clients (server and web)
│   │   ├── contracts/        # oRPC contract definitions
│   │   │   ├── all.contracts.ts    # Master contract registry
│   │   │   ├── oc.base.ts          # Base oRPC with error definitions
│   │   │   ├── seo.contract.ts     # SEO route contracts
│   │   │   └── test.contract.ts    # Test route contracts
│   │   ├── handlers/         # RPC and OpenAPI request handlers
│   │   ├── middlewares/      # oRPC middlewares (validation, errors)
│   │   ├── procedures/
│   │   │   └── base.ts       # Base oRPC procedure with context
│   │   ├── routers/          # oRPC router implementations
│   │   │   ├── all.routers.ts      # Router registry
│   │   │   ├── test.ts             # Test procedures
│   │   │   └── seo/                # SEO procedures
│   │   ├── schemas/          # Zod validation schemas
│   │   │   ├── test.schema.ts      # Test input schemas
│   │   │   └── openapi.schema.generator.ts
│   │   └── seo/              # SEO, OG images, LLM documentation
│   │       ├── og/           # OG image generation components
│   │       ├── html.handler.ts     # LLM HTML documentation
│   │       ├── llms.ts             # LLM routes
│   │       ├── og.handler.ts       # OG image handler
│   │       └── txt.handler.ts      # LLM text documentation
│   ├── styles/               # Global CSS and Tailwind configuration
│   ├── content.config.ts     # Astro content collections config
│   ├── env.d.ts              # TypeScript ambient declarations
│   └── middleware.ts         # Astro middleware (cache control)
├── astro.config.mjs          # Astro configuration
├── boneyard.config.json      # Boneyard skeleton configuration
├── components.json           # shadcn/ui configuration
├── knip.json                 # Unused dependency analysis config
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🏗️ Architecture

### Hybrid SSR/Islands Model

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Astro v6 + React 19 | SSR with selective hydration |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with base-vega style |
| API | Hono v4 + oRPC v1.13 | Type-safe RPC with OpenAPI support |
| State | Nanostores + TanStack Query v5 | Reactive state + data fetching |
| Validation | Zod v4 | Schema validation for env and API |
| Docs | Scalar | OpenAPI documentation |

### Key Architectural Decisions

1. **Islands Architecture**: React components are hydrated selectively using `client:load` directive
2. **Contract-First API**: oRPC contracts define input/output schemas before implementation
3. **Type Safety End-to-End**: Zod schemas validate environment, API inputs, and outputs
4. **Server-Side Rendering**: Astro `output: 'server'` mode with Bun adapter for ISR support

---

## 🔌 API Endpoints

All API routes are prefixed with `/api/`.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (`{ status: 'ok' }`) |
| `POST` | `/api/rpc/*` | oRPC procedure calls |
| `GET` | `/api/docs` | Scalar API documentation (all APIs combined) |
| `GET` | `/api/openapi/orpc-docs` | Scalar documentation (oRPC only) |
| `GET` | `/api/openapi/generate-schema` | Raw OpenAPI JSON spec for oRPC |
| `GET` | `/api/llms.txt` | AI-optimized documentation (Markdown) |
| `GET` | `/api/llms.html` | Human-readable documentation (PicoCSS) |
| `GET` | `/api/og` | Dynamic OG image generation |

### oRPC Procedures

Procedures are defined in `src/server/routers/` with contracts in `src/server/contracts/`.

#### Test Procedures

| Procedure | Method | Path | Description |
|-----------|--------|------|-------------|
| `tests.test` | `GET` | `/api/rpc/tests/test` | Basic connectivity test |
| `tests.slowTest` | `POST` | `/api/rpc/tests/slow-test` | Long-running task (6s) for testing cancellation |

#### SEO Procedures

| Procedure | Method | Path | Description |
|-----------|--------|------|-------------|
| `seo.og` | `GET` | `/api/rpc/seo/og` | Generate OG image |
| `seo.llmsHtml` | `GET` | `/api/rpc/seo/llms.html` | Generate LLM HTML docs |
| `seo.llmsTxt` | `GET` | `/api/rpc/seo/llms.txt` | Generate LLM text docs |

### Adding New oRPC Procedures

**Step 1:** Create a Zod schema in `src/server/schemas/`:

```typescript
// src/server/schemas/my.schema.ts
import { z } from 'zod';

export const mySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
});
```

**Step 2:** Define the contract in `src/server/contracts/`:

```typescript
// src/server/contracts/my.contract.ts
import { baseOc } from '@/server/contracts/oc.base';
import { mySchema } from '@/server/schemas/my.schema';

export const myProcedure = baseOc
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Description of what this does',
    summary: 'Short summary',
    tags: ['MyTag'],
    successDescription: 'Success response description',
    successStatus: 200,
  })
  .input(mySchema)
  .output(mySchema);
```

**Step 3:** Export the contract in `src/server/contracts/all.contracts.ts`:

```typescript
import { myProcedure } from '@/server/contracts/my.contract';

export const appContract = {
  // ...existing
  my: {
    myProcedure,
  },
};
```

**Step 4:** Implement the router in `src/server/routers/`:

```typescript
// src/server/routers/my.ts
import { base } from '@/server/procedures/base';
import { myProcedure } from '@/server/contracts/my.contract';

export const myRoute = base.my.myProcedure.handler(async ({ input, context, errors }) => {
  // Handler logic
  return { id: input.id, name: input.name };
});
```

**Step 5:** Export the router in `src/server/routers/all.routers.ts`:

```typescript
import { myRoute } from '@/server/routers/my';

export const allRouters = {
  // ...existing
  my: {
    myRoute,
  },
};
```

**Step 6:** Call from client using the oRPC client:

```typescript
import { client } from '@/lib/server/web.client';

const result = await client.my.myProcedure({ id: '123', name: 'Test' });
```

---

## 🖼️ Dynamic OG Image Generation

Social cards are generated on-the-fly using React components and Satori.

### Features

- **Template**: `src/server/seo/og/Generate.tsx`
- **Caching**: Redis-backed cache with 7-day TTL
- **Format**: Auto-detects WebP support, falls back to PNG for bots
- **Headers**: Sets proper `Cache-Control`, `Content-Type`, and `Content-Disposition`

### Usage

```tsx
// In Astro component
<meta property="og:image" content={`/api/og?title=${encodeURIComponent(title)}`} />
```

### Query Parameters

| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| `title` | string | ✅ | "Fast Web Tech" |
| `description` | string | ✅ | "My awesome app" |
| `author` | string | ❌ | "Alberto" |
| `date` | ISO date | ❌ | Current date |

---

## 🤖 LLM-Friendly Documentation

The project exports API documentation in formats optimized for Large Language Models.

### Endpoints

| Endpoint | Format | Use Case |
|----------|--------|----------|
| `/api/llms.txt` | Markdown | AI prompts, Cursor, Claude context |
| `/api/llms.html` | HTML (PicoCSS) | Human-readable browser view |

### Implementation

- Uses `@scalar/openapi-to-markdown` to convert oRPC contracts
- Includes full API surface area with types and descriptions
- Ideal for providing full API awareness to AI assistants

---

## 🧩 Agent Skills

This project includes a modular skills system for AI assistants.

### Location

- **Skills Directory**: `.agents/skills/`
- **Pre-installed**: `qwen-coder-docs` for code generation and documentation

### Adding Custom Skills

Create a new folder in `.agents/skills/` with a `SKILL.md` file:

```
.agents/skills/
└── my-custom-skill/
    └── SKILL.md  # Skill definition and instructions
```

---

## 🔧 Development Guidelines

### Qwen Coder Style

This project follows the **Qwen Coder Documentation Skill** rules:

| Rule | Description |
|------|-------------|
| **Explicit over Implicit** | Define types and imports clearly |
| **Typed Everything** | No usage of `any` |
| **Named Exports** | Prefer named exports for reliable symbol tracking |
| **Intent Comments** | Add JSDoc explaining *why* a function exists |

### Component Patterns

#### Astro Components

```astro
---
// Always define Props interface
interface Props {
  title: string;
  count?: number;
}

const { title, count = 0 }: Props = Astro.props;
---

<div>
  <h1>{title}</h1>
  <p>Count: {count}</p>
</div>
```

#### React Islands

```tsx
'use client';

import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      {count}
    </button>
  );
}
```

#### oRPC Procedures

```typescript
import { base } from '@/server/procedures/base';
import { mySchema } from '@/server/schemas/my.schema';

export const myRoute = base
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Description of what this does',
    tags: ['MyTag'],
  })
  .input(mySchema)
  .output(mySchema)
  .handler(async ({ input, context, errors }) => {
    // Handler implementation
    return { result: 'success' };
  });
```

### Error Handling

oRPC errors are defined in `src/server/contracts/oc.base.ts`:

| Error | Status | Description |
|-------|--------|-------------|
| `BAD_REQUEST` | 400 | Invalid or malformed request |
| `UNAUTHORIZED` | 401 | Authentication required/failed |
| `FORBIDDEN` | 403 | Permission denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `INPUT_VALIDATION_FAILED` | 422 | Input validation failed |
| `OUTPUT_VALIDATION_FAILED` | 500 | Invalid response format |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| `CLIENT_CLOSED_REQUEST` | 499 | Client terminated request |

### Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@rcomp/*` | `./src/components/reactcomp/*` |
| `@acomp/*` | `./src/components/astrocomp/*` |

---

## 🧪 Testing & Validation

### Commands

| Command | Description |
|---------|-------------|
| `bun ts:check` | TypeScript type checking |
| `bun format` | Format code with Prettier |
| `bun knip` | Find unused code and dependencies |
| `bun knip:fix` | Auto-fix unused code issues |
| `bun run generate:contract` | Sync oRPC contract JSON |
| `bun run og:test` | Test OG image generation |

### Code Quality Tools

- **TypeScript**: Strict mode enabled
- **Prettier**: Multi-plugin setup (Astro, Tailwind, classnames, merge, import-sort)
- **Knip**: Dead code and dependency detection
- **Husky**: Pre-commit hooks for formatting

---

## 📦 Dependencies

### Core

- `astro` v6.1.9
- `react` v19.2.4
- `hono` v4.12.8
- `@orpc/*` v1.13.x
- `zod` v4.3.6
- `tailwindcss` v4.2.2

### UI

- `shadcn` v4.0.8 (base-vega style)
- `@base-ui/react` v1.3.0
- `lucide-react` v1.8.0
- `sonner` v2.0.7 (toast notifications)

### State & Data

- `nanostores` v1.2.0
- `@tanstack/react-query` v5.94.5
- `idb-keyval` v6.2.2 (IndexedDB persistence)

### Infrastructure

- `@hono/node-server` v1.19.11
- `ioredis` v5.10.1
- `@wyattjoh/astro-bun-adapter` v2.0.1

---

## 📄 License

MIT License
