# Astro-Hono-oRPC Full-Stack Application

A modern full-stack web application combining **Astro** for frontend rendering with **Hono** and **oRPC** for type-safe API development.

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

This project currently has no required environment variables. When adding authentication or database features, create a `.env` file based on `.env.example` (if present).

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
│   │       └── TestClient.tsx  # Example React island component
│   ├── layouts/
│   │   └── Layout.astro        # Main layout with theme support (dark/light)
│   ├── lib/
│   │   └── server/             # Server-side oRPC/Hono code
│   │       ├── app.ts          # Hono app configuration with CORS & middleware
│   │       ├── middlewares/
│   │       │   └── validation-errors.ts  # oRPC validation error handler
│   │       ├── open-api-handler/
│   │       │   └── handler.ts  # OpenAPI schema generation
│   │       ├── procedures/
│   │       │   └── base.ts     # Base oRPC procedure with error definitions
│   │       ├── routers/
│   │       │   ├── all.routers.ts  # Router aggregator
│   │       │   └── test.ts     # Example oRPC router
│   │       ├── schemas/
│   │       │   └── test.schema.ts  # Zod validation schemas
│   │       ├── server.client.ts    # Server-side oRPC client
│   │       └── web.client.ts       # Browser oRPC client
│   ├── pages/
│   │   ├── api/
│   │   │   └── [...path].ts    # Hono API catch-all route
│   │   └── index.astro         # Home page
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

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Astro v6 | Server-side rendering, static generation |
| **UI Framework** | React v19 | Interactive islands (hydrated components) |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with pre-built components |
| **API** | Hono v4 | Lightweight web framework for API routes |
| **RPC** | oRPC v1.13 | Type-safe RPC with OpenAPI support |
| **State** | Nanostores + TanStack Query | Client-side state management |
| **Validation** | Zod v4 | Schema validation for inputs/outputs |
| **API Docs** | Scalar | Interactive OpenAPI documentation |
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
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Scalar Documentation](https://scalar.com)

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
