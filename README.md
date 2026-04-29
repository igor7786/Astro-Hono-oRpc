# Astro-Hono-oRPC Full-Stack Application

A modern full-stack web application combining **Astro** for frontend rendering with **Hono** and **oRPC** for type-safe API development, featuring **TanStack Query** with SSR support, **IndexedDB persistence**, **contract-first API design**, **dynamic OG image generation**, **SEO optimization**, **LLM-friendly documentation**, and **Nanostores** state management.

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

The dev server runs at `http://localhost:4321` (exposed to network with `--host`).

### Environment Variables

Copy `.example.env` to `.env` and fill in the required values:

```bash
cp .example.env .env
```

> **Note:** The `.example.env` file contains minimal defaults. The application validates a comprehensive set of environment variables at startup.

#### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BUN_FS_POLLING` | Enable Bun file system polling (set to `1`) | ✅ |
| `DB_URL` | Database connection string (NeonDB/PostgreSQL) | ✅ |
| `UPSTASH_REDIS_URL` | Upstash Redis connection URL | ✅ |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session encryption | ✅ |
| `BETTER_AUTH_URL` | Base URL for Better Auth (e.g., `http://localhost:4321`) | ✅ |
| `PUBLIC_URL` | Public-facing application URL | ✅ |
| `PUBLIC_API_URL` | Public API base URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ✅ |
| `RESEND_EMAIL` | Resend API key for transactional emails | ✅ |
| `ARCJET_KEY` | Arcjet security API key | ✅ |
| `ARCJET_ENV` | Arcjet environment (e.g., `development`, `production`) | ✅ |
| `CLOUD_TOKEN` | Cloud service authentication token | ✅ |
| `QWEN_API_KEY` | Qwen API key for AI features | ✅ |
| `PANGOLIN_ENDPOINT` | Pangolin service endpoint URL | ✅ |
| `NEWT_SECRET` | Newt service authentication secret | ✅ |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`, `preview`). Defaults to `development` | ❌ |

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

### Available Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun dev` | Start development server at `localhost:4321` |
| `bun build` | Build production site to `./dist/` |
| `bun preview` | Preview production build locally |
| `bun:dev` | Start development server with Bun (host mode, exposed to network) |
| `bun:build` | Build production site with Bun |
| `bun:preview` | Preview production build with Bun |
| `bun astro ...` | Run Astro CLI commands (e.g., `astro add`, `astro check`) |
| `bun ts:check` | Type check with TypeScript (no emit) |
| `bun format` | Format code with Prettier |
| `og:test` | Test OG image generation (`bun run src/lib/server/seo/og/test-simple-og.ts`) |

---

## 📁 Project Structure

```
src/
├── assets/                   # Static image assets
│   ├── astro.svg
│   └── background.svg
├── components/
│   ├── astrocomp/           # Astro-native UI components (SSR, no hydration)
│   │   ├── SEO.astro        # Reusable SEO component (OG, Twitter, JSON-LD)
│   │   ├── Welcome.astro    # Welcome page component
│   │   └── blog/
│   │       └── BlogCard.astro  # Blog post card component
│   └── reactcomp/           # React components (islands architecture)
│       ├── lib/
│       │   └── utils.ts     # Utility functions (cn helper)
│       ├── ui/
│       │   ├── button.tsx   # Button with base-ui + CVA variants
│       │   ├── sonner.tsx   # Toast notification component
│       │   ├── avatar.tsx   # Avatar component with fallback
│       │   ├── dropdown-menu.tsx  # Dropdown menu component
│       │   ├── separator.tsx  # Visual separator
│       │   └── textarea.tsx  # Textarea input component
│       ├── nanostores/
│       │   ├── ChatIndicator.tsx    # Online/offline indicator with toast
│       │   ├── NanStoresQuery.tsx   # Nanostores + TanStack Query integration
│       │   └── AnyOtherComponent.tsx # Shared nanostore state demo
│       ├── SlowRequest.tsx          # Request cancellation demo
│       ├── TestClient.tsx           # Example React island
│       ├── TestImage.tsx            # Astro Image/Picture wrapper
│       ├── TestTanstackQuery.tsx    # TanStack Query example
│       └── blog/
│           ├── CommentSection.tsx   # Blog comments with interaction
│           ├── LikeButton.tsx       # Blog post like button
│           └── ShareWidget.tsx      # Social sharing widget
├── layouts/
│   └── Layout.astro         # Main layout with theme + QueryDevTools
├── lib/
│   ├── env/                 # Environment variable validation
│   │   ├── client.env.ts    # Client-side env (PUBLIC_* vars)
│   │   └── server.env.ts    # Server-side env (Zod validation)
│   ├── queues/
│   │   └── redis.ts         # Redis client with TLS + retry strategy
│   ├── stores/
│   │   ├── online.ts        # $isOnline atom (browser events)
│   │   └── ssr.ts           # $testData atom for SSR state
│   ├── tanstack-query/
│   │   ├── mainQuery.ts     # QueryClient with IndexedDB + SuperJSON
│   │   ├── query.ts         # Server-side query client
│   │   ├── QueryDevTools.tsx  # DevTools component
│   │   └── SsrQueryProvider.tsx  # SSR hydration provider
│   └── server/
│       ├── app.ts           # Hono app + CORS + middleware
│       ├── contracts/
│       │   ├── all.contracts.ts  # Contract aggregator
│       │   ├── oc.base.ts        # Base contract with error schema
│       │   └── test.contract.ts  # Example contract
│       ├── handlers/
│       │   ├── openapi.handler.ts  # OpenAPI + Scalar docs
│       │   └── rpc.handler.ts      # oRPC procedure handler
│       ├── middlewares/
│       │   └── validation-errors.ts # Validation error handler
│       ├── procedures/
│       │   └── base.ts      # Base procedure with context
│       ├── routers/
│       │   ├── all.routers.ts  # Router aggregator
│       │   └── test.ts      # Example router (test + slowTest)
│       ├── schemas/
│       │   ├── oenapi.schema.generator.ts  # OpenAPI schema generator
│       │   ├── seo.schema.ts    # SEO metadata Zod schema
│       │   └── test.schema.ts   # Test validation schema
│       ├── seo/
│       │   ├── html.handler.ts   # LLMs.html handler
│       │   ├── llms.ts           # OpenAPI-to-Markdown conversion
│       │   ├── og.handler.ts     # OG image generation route
│       │   ├── txt.handler.ts    # LLMs.txt handler
│       │   └── og/
│       │       ├── Generate.tsx      # OG image React template
│       │       ├── SocialCard.tsx    # Social card layout
│       │       ├── cache.ts          # Redis caching (7-day TTL)
│       │       └── fonts.ts          # Satori font loading
│       ├── server.client.ts   # Server-side oRPC client
│       └── web.client.ts      # Browser oRPC client (8s timeout)
├── pages/
│   ├── api/
│   │   └── [...path].ts     # Hono API catch-all route
│   ├── index.astro          # Home page with SSR data fetching
│   ├── indicator.astro      # Online/offline status demo
│   ├── images.astro         # Image optimization test (Image/Picture)
│   ├── fonts-test.astro     # Font rendering test page
│   ├── llms.txt.astro       # LLM-friendly API docs route
│   ├── nanostore.astro      # Nanostores integration demo
│   ├── og.astro             # OG image test page
│   ├── robots.txt.ts        # Dynamic robots.txt (env-aware)
│   └── blog/
│       ├── index.astro      # Blog listing page (all posts)
│       └── [id].astro       # Individual blog post (dynamic route)
├── scripts/
│   └── theme-checker.js     # Dark mode detection
├── styles/
│   └── global.css           # Tailwind + shadcn styles
├── middleware.ts            # Astro middleware (cache control)
└── content.config.ts        # Content collections configuration (blog)
```

---

## 🏗️ Architecture

### Hybrid Architecture

- **Static/SSR pages** served by Astro
- **API routes** handled by Hono with oRPC for type-safe RPC calls
- **Islands architecture** - React components hydrated selectively via `client:load`
- **SSR with TanStack Query** - Server-side data fetching with client hydration

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Astro v6 | SSR, static generation |
| **UI Framework** | React v19 + @base-ui/react | Interactive islands |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS |
| **API** | Hono v4 | Web framework for API |
| **RPC** | oRPC v1.13 | Type-safe RPC + OpenAPI |
| **State** | Nanostores + TanStack Query | Client state management |
| **Query Cache** | IndexedDB (idb-keyval) | Persistent cache + SuperJSON |
| **Validation** | Zod v4 | Schema validation |
| **API Docs** | Scalar | OpenAPI documentation |
| **OG Images** | @takumi-rs/image-response + satori | Dynamic image generation |
| **Icons** | lucide-react | Icon library |
| **Toasts** | sonner | Toast notifications |
| **Themes** | next-themes | Dark/light theme |
| **Image Processing** | sharp + @resvg/resvg-js | Image manipulation |
| **Caching** | ioredis (Upstash Redis) | Distributed cache |
| **Serialization** | superjson | Complex type preservation |
| **Runtime** | Node.js >= 22.12.0 | Server runtime |
| **Package Manager** | Bun | Fast package management |

---

## 🔌 API Endpoints

All API routes prefixed with `/api/`.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (`{ status: 'ok' }`) |
| `POST` | `/api/rpc/*` | oRPC procedure calls |
| `GET` | `/api/docs` | Scalar API documentation |
| `GET` | `/api/rpc/generate-schema` | OpenAPI schema for oRPC |
| `GET` | `/api/openapi/generate-schema` | Raw OpenAPI JSON spec |
| `GET` | `/api/openapi/orpc-docs` | Scalar docs for oRPC API |
| `GET` | `/api/llms.txt` | API docs as plain text markdown (for AI tools) |
| `GET` | `/api/llms.html` | API docs as styled HTML (PicoCSS) |
| `GET` | `/api/og` | Dynamic OG image generation (PNG, 1200x630) |
| `GET` | `/robots.txt` | Dynamic robots.txt (disallows in non-production) |
| `GET` | `/sitemap-index.xml` | Auto-generated sitemap |

### oRPC Procedures

#### GET `/api/rpc/tests/test`

Test procedure for oRPC configuration. Note: routes have explicit path prefixes (`/tests`, `/seo`) for contract organization.

**Input:**
```typescript
{ name: string }  // 3-40 characters
```

**Output:**
```typescript
{ name: string }  // Returns: { name: 'Hello, {name}!' }
```

**Errors:**
| Status | Code | Reason |
|--------|------|--------|
| 403 | `FORBIDDEN` | If name is "admin" |
| 422 | `INPUT_VALIDATION_FAILED` | Invalid input |

#### POST `/api/rpc/tests/slow-test`

Simulates slow operation (3s delay) to test cancellation.

**Features:**
- Supports `AbortSignal` for request cancellation
- Returns `CLIENT_CLOSED_REQUEST` (499) when aborted
- Sets custom headers and cookies

**Example:**
```typescript
import { client } from '@/lib/server/web.client';

const result = await client.tests.slowTest({ name: 'World' });
// Returns after ~3 seconds
```

---

## 🖼️ Dynamic OG Image Generation

Generate social card images dynamically using React components and Satori.

### Architecture

- **Templates** - React components define card layouts (`SocialCard.tsx`)
- **Rendering** - `@takumi-rs/image-response` converts HTML/CSS to PNG
- **Fonts** - Auto-loaded from `/public/fonts/` via `fonts.ts`
- **Caching** - Redis-backed cache with 7-day TTL (`cache.ts`)
- **SEO Schema** - Zod-validated metadata (`seo.schema.ts`)

### Usage

**Endpoint:**
```
GET /api/og?title=My+Page&description=My+Description&type=default
```

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | string | - | Card title (required) |
| `description` | string | - | Card description |
| `type` | `'default' \| 'simple'` | `default` | Card template type |

**Example:**
```html
<meta property="og:image" content="/api/og?title=My+Page" />
```

### Testing

```bash
# Run OG test script
bun run og:test

# Or visit directly
http://localhost:4321/og
```

---

## 🔍 SEO & Meta Tags

### SEO Component (`@acomp/SEO.astro`)

Comprehensive SEO component supporting:
- **Open Graph tags** - Facebook, LinkedIn, Discord
- **Twitter Cards** - Summary and large image cards
- **JSON-LD** - Structured data for search engines
- **Canonical URLs** - Prevent duplicate content
- **Sitemap link** - Auto-included in `<head>`

**Usage:**
```astro
---
import SEO from '@/components/astrocomp/SEO.astro';
import { createSeo } from '@/lib/server/schemas/seo.schema';

const seo = createSeo({
  title: 'My Page',
  description: 'Page description',
  image: '/api/og?title=My+Page',
});
---
<SEO {...seo} />
```

### Robots.txt

Dynamic `robots.txt` generation:
- **Production** - Allows all crawling
- **Development/Preview** - Disallows all

### Sitemap

Auto-generated sitemap with:
- Smart `lastmod` detection
- Filtered routes (excludes API, images, test pages)
- Priority and changefreq metadata

---

## 🤖 LLM-Friendly Documentation

Auto-generated API documentation optimized for AI tools.

### Endpoints

| Endpoint | Format | Use Case |
|----------|--------|----------|
| `/api/llms.txt` | Plain text markdown | Cursor, Claude, ChatGPT |
| `/api/llms.html` | Styled HTML (PicoCSS) | Browser viewing |

### Features

- **OpenAPI-to-Markdown** - Converts oRPC contracts to readable docs
- **Structured** - Clear sections for endpoints, inputs, outputs
- **AI-Optimized** - Formatted for LLM consumption

**Usage in AI tools:**
```
Add this to your project context:
https://your-domain.com/api/llms.txt
```

---

## 💾 State Management

### Nanostores

Lightweight reactive state management.

**Stores:**
- `$isOnline` (`src/lib/stores/online.ts`) - Browser online/offline status
- `$testData` (`src/lib/stores/ssr.ts`) - SSR state sharing

**Usage:**
```tsx
import { $isOnline } from '@/lib/stores/online';
import { useStore } from '@nanostores/react';

function OnlineIndicator() {
  const online = useStore($isOnline);
  return <span>{online ? '🟢 Online' : '🔴 Offline'}</span>;
}
```

**Nanostores + TanStack Query Integration:**
Components can use nanostores as a cache layer before triggering TanStack Query fetches, enabling cache-first strategies.

### TanStack Query

#### Features

- **SSR Support** - Server-side data fetching with hydration
- **IndexedDB Persistence** - 24h TTL, persists across sessions
- **SuperJSON Serialization** - Preserves Dates, Maps, Sets
- **Request Cancellation** - AbortController integration
- **Query Prefetching** - Optimistic loading on hover
- **DevTools** - Embedded QueryDevTools component

#### Architecture

```
mainQuery.ts  →  Browser QueryClient (IndexedDB + SuperJSON)
query.ts      →  Server QueryClient (SSR only)
```

#### Usage

**Server-side (Astro page):**
```typescript
---
import { serverClient } from '@server/server.client';
const data = await serverClient.tests.test({ name: 'SSR' });
---
```

**Client-side (React component):**
```tsx
import { useQuery } from '@tanstack/react-query';
import { clientOrpc as orpc } from '@server/web.client';

const { data } = useQuery(
  orpc.tests.test.queryOptions({
    input: { name: 'test' },
    queryKey: ['tests', 'test', { name }],
    initialData: serverData, // SSR hydration
  }),
  client
);
```

**Request Cancellation:**
```tsx
// Cancel running queries
client.cancelQueries({ queryKey: ['tests', 'slow-test'] });

// Prefetch on hover
client.prefetchQuery(
  orpc.tests.slowTest.queryOptions({
    input: { name: 'test' },
    queryKey: ['tests', 'slow-test'],
  })
);
```

---

## 📝 Blog & Content Collections

Astro Content Collections with Markdown-based blog system.

### Architecture

- **Content Layer** - Type-safe content management with Zod validation
- **Markdown Processing** - Automatic reading time calculation
- **RSS-ready** - Sitemap integration with blog priority settings
- **Draft Support** - Draft flag for unpublished posts

### Content Configuration (`src/content.config.ts`)

```typescript
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});
```

### Blog Components

**Astro Components:**
- `BlogCard.astro` - Blog post card with metadata display

**React Components:**
- `CommentSection.tsx` - Interactive comments widget
- `LikeButton.tsx` - Like/favorite button with state
- `ShareWidget.tsx` - Social sharing component

### Usage

**Creating a new blog post:**

Create a markdown file in `src/data/blog/`:

```markdown
---
title: "My First Post"
description: "A brief description"
author: "Author Name"
date: "2024-01-15"
tags: ["astro", "blog"]
draft: false
---

# My First Post

Content goes here...
```

**Listing posts (`/blog`):**
- Auto-fetches from content collection
- Filters out draft posts
- Sorts by date (newest first)
- Displays reading time

**Individual posts (`/blog/[id]`):**
- Dynamic routing with slug-based URLs
- Markdown rendering with syntax highlighting
- Reading time calculation

### Sitemap Integration

Blog posts are automatically added to sitemap with:
- **Priority:** 0.8
- **Change frequency:** monthly
- **Last modified:** Uses frontmatter `updated` or `date` field

---

## 📝 Contract-First API Design

API contracts defined separately from implementations for type safety.

### Architecture

```
contracts/
  oc.base.ts          →  Base contract with error schema
  test.contract.ts    →  Individual contract
  all.contracts.ts    →  Contract aggregator
```

### Example

Contracts use explicit path prefixes for organization (e.g., `/tests`, `/seo`). This helps namespace related endpoints.

```typescript
// Define contract
export const myContract = baseOc
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Endpoint description',
    tags: ['MyTag'],
  })
  .input(myInputSchema)
  .output(myOutputSchema);

// Export in aggregator
export const appContract = {
  my: myContract,
};
```

### Benefits

- **Type-safe clients** - Full TypeScript inference
- **OpenAPI generation** - Auto-generated from contracts
- **Error consistency** - Shared error definitions
- **Decoupled design** - Contracts separate from implementation

---

## 🎨 Styling & Theming

### Tailwind CSS v4

- Vite integration (no separate config file)
- Utility-first CSS framework

### shadcn/ui (base-vega style)

- Pre-built UI components
- CSS variables for theming
- Lucide icons

### Theme System

- **Auto-detection** - `theme-checker.js` script
- **Dark/Light modes** - Toggled via `next-themes`
- **OKLCH colors** - Perceptually uniform color space
- **Semantic tokens** - Sidebar, chart, and semantic colors

**CSS Variables defined in `src/styles/global.css`:**
- Base colors (background, foreground, primary, secondary)
- Semantic colors (success, warning, error, info)
- Component colors (sidebar, cards, dialogs)

---

## 🛠️ Configuration

### Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@rcomp/*` | `./src/components/reactcomp/*` |
| `@acomp/*` | `./src/components/astrocomp/*` |
| `@server/*` | `./src/lib/server/*` |

### Astro Configuration

- **Output:** `server` (SSR mode)
- **Adapter:** `@astrojs/node` (standalone)
- **React:** Islands architecture (`client:load`)
- **Sitemap:** Auto-generated with smart lastmod
- **Fonts:** Inter (body), Playfair Display (headings), JetBrains Mono (code)
- **Shiki theme:** Dracula (Markdown code blocks)
- **Allowed hosts:** `fast-web-tech.co.uk`, `localhost`, `host.docker.internal`

### TypeScript

- **Strict mode:** Enabled
- **JSX:** `react-jsx`
- **Module resolution:** `bundler`

### Prettier

- **Line length:** 105 characters
- **Quotes:** Single
- **Semicolons:** Required
- **Plugins:** astro, classnames, tailwindcss, merge

---

## 🔧 Development Guidelines

### Code Style

- **Explicit over implicit** - Define types and imports clearly
- **No magic** - Avoid clever one-liners
- **Named exports** - Prefer over default exports
- **Comments on intent** - Document _what_ and _why_, not _how_

### Component Patterns

#### Astro Components

```astro
---
interface Props {
  title: string;
}
const { title }: Props = Astro.props;
---
<h1>{title}</h1>
```

#### React Components

```tsx
'use client';
import { Button } from '@rcomp/ui/button';

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

### oRPC Patterns

**Procedure:**
```typescript
import { base } from '@server/procedures/base';

export const myProcedure = base
  .route({
    method: 'GET',
    path: '/my-endpoint',
    description: 'Description',
    tags: ['Tag'],
  })
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ input, context }) => {
    return { result: 'Success' };
  });
```

**Adding New Procedures:**
1. Create schema in `src/lib/server/schemas/`
2. Create router in `src/lib/server/routers/`
3. Export router in `all.routers.ts`
4. Call from client using `@/lib/server/web.client`

### Error Handling

| Error | Status | Message |
|-------|--------|---------|
| `BAD_REQUEST` | 400 | Bad Request |
| `UNAUTHORIZED` | 401 | You are Unauthorized |
| `FORBIDDEN` | 403 | You are Forbidden |
| `NOT_FOUND` | 404 | Not Found |
| `CONFLICT` | 409 | Resource conflict |
| `INPUT_VALIDATION_FAILED` | 422 | Input validation failed |
| `OUTPUT_VALIDATION_FAILED` | 500 | Output validation failed |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `CLIENT_CLOSED_REQUEST` | 499 | Client closed the request |
| `INTERNAL_SERVER_ERROR` | 500 | Internal Server Error |

### Client-Side oRPC Features

The web client (`web.client.ts`) includes:
- **8-second timeout** - Auto-aborts long requests
- **Cookie auth** - `credentials: 'include'`
- **Response validation** - `ResponseValidationPlugin`
- **Auto-redirect** - On `UNAUTHORIZED` → `/login`, `FORBIDDEN` → `/403`

---

## 🧪 Testing

No test framework currently configured.

**Recommended:**
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## 📚 Additional Resources

- [Astro](https://docs.astro.build)
- [Hono](https://hono.dev)
- [oRPC](https://orpc.unno.io)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [base-ui](https://base-ui.com)
- [Scalar](https://scalar.com)
- [Nanostores](https://github.com/nanostores/nanostores)
- [Sonner](https://sonner.emilkowal.ski)
- [Satori](https://github.com/vercel/satori)
- [Zod](https://zod.dev)

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
