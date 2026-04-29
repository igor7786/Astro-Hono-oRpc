# Astro-Hono-oRPC Full-Stack Application

A modern full-stack web application combining **Astro v6** for frontend rendering with **Hono v4** and **oRPC v1.13** for type-safe API development. Featuring **TanStack Query v5** with SSR support, **IndexedDB persistence**, **contract-first API design**, **dynamic OG image generation**, **Boneyard skeleton system**, **SEO optimization**, **LLM-friendly documentation**, and **Nanostores** state management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.12.0
- **Bun** >= 1.2.0 (recommended package manager and runtime)

### Installation

```bash
# Install dependencies
bun install

# Generate API contracts
bun run generate:contract

# Start development server
bun dev
```

The dev server runs at `http://localhost:4321`.

### Environment Variables

Copy `.example.env` to `.env` and fill in the required values:

```bash
cp .example.env .env
```

> **Note:** The application validates environment variables at startup using Zod schemas found in `src/lib/env/`.

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
| `RESEND_EMAIL` | Resend API key | ✅ |
| `ARCJET_KEY` | Arcjet security API key | ✅ |
| `QWEN_API_KEY` | Qwen API key for AI features | ✅ |

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
.
├── .agents/                  # Agent skills and local agent configurations
│   └── skills/               # Reusable agent capabilities (e.g., qwen-coder-docs)
├── .husky/                   # Git hooks (pre-commit, pre-push)
├── .qwen/                    # Qwen-specific configurations and documentation
├── public/                   # Static assets (fonts, icons, robots.txt)
├── src/
│   ├── assets/               # Local images and global styles
│   ├── bones/                # Boneyard skeleton loading definitions
│   │   ├── Card.bones.json   # Bone structure for Card component
│   │   └── registry.js       # Boneyard component registry
│   ├── components/
│   │   ├── astrocomp/        # Astro-native UI components (SSR, no hydration)
│   │   └── reactcomp/        # React components (islands architecture)
│   │       ├── ui/           # shadcn/ui generated components
│   │       └── nanostores/   # Components using shared reactive state
│   ├── layouts/              # Main page layouts
│   ├── lib/
│   │   ├── env/              # Zod-validated environment configurations
│   │   ├── helpers/          # Logger, path utilities, and theme checkers
│   │   ├── stores/           # Nanostores (online status, SSR data)
│   │   └── server/           # Server-side logic (Hono, oRPC, SEO)
│   ├── pages/
│   │   ├── api/              # Hono API catch-all route
│   │   └── playground/       # Component tests and interactive demos
│   ├── styles/               # Global Tailwind CSS and shadcn variables
│   └── middleware.ts         # Astro middleware for session management
├── boneyard.config.json      # Boneyard skeleton loading configuration
├── components.json           # shadcn/ui configuration
├── knip.json                 # Unused dependency analysis config
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript compiler settings
```

---

## 🏗️ Architecture

### Hybrid SSR/Islands Model

- **Astro v6**: Orchestrates the frontend, providing fast SSR and selective hydration via React islands.
- **Hono v4**: Serves as the robust API layer, mounted under `/api`.
- **oRPC v1.13**: Provides contract-first, type-safe RPC calls between client and server.
- **TanStack Query v5**: Manages data fetching with built-in SSR hydration and IndexedDB persistence.

### Skeleton Loading (Boneyard)

The project uses **Boneyard-js** for high-performance skeleton screens.
- **Design-Driven**: Skeletons are defined in JSON files (`src/bones/`).
- **Reactive**: Themes automatically switch between light and dark modes.
- **Registry**: Managed via `src/bones/registry.js` for consistent usage across components.

---

## 🔌 API Endpoints

All API routes are prefixed with `/api/`.

### Core API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (`{ status: 'ok' }`) |
| `POST` | `/api/rpc/*` | oRPC procedure calls (type-safe RPC) |
| `GET` | `/api/docs` | Combined Scalar API documentation |
| `GET` | `/api/rpc/orpc-docs` | Scalar documentation for oRPC only |
| `GET` | `/api/rpc/generate-schema` | Raw OpenAPI JSON spec for oRPC |
| `GET` | `/api/llms.txt` | AI-optimized documentation (Markdown) |
| `GET` | `/api/llms.html` | Human-readable documentation (PicoCSS) |
| `GET` | `/api/og` | Dynamic OG image generation |

### oRPC Procedures

Procedures are defined in `src/server/routers/`. Example endpoints:
- `tests.test`: Basic connectivity and validation test.
- `tests.slowTest`: Long-running task to test cancellation and loading states.
- `seo.og`: Manual triggering of social image generation.

---

## 🖼️ Dynamic OG Image Generation

Social cards are generated on-the-fly using React components and Satori.
- **Template**: `src/server/seo/og/SocialCard.tsx`.
- **Caching**: Redis-backed cache with 7-day TTL.
- **Format**: Auto-detects WebP support, falls back to PNG for bots.
- **Usage**: `<meta property="og:image" content="/api/og?title=Page+Title" />`.

---

## 🤖 LLM-Friendly Documentation

The project exports its API surface area in formats optimized for Large Language Models.
- **Endpoint**: `/api/llms.txt`.
- **Tooling**: Uses `openapi-to-markdown` to convert contracts into structured prompts.
- **Context**: Ideal for use with Cursor, Claude, or ChatGPT to provide full API awareness.

---

## 🔧 Development Guidelines

### Qwen Coder Style

This project follows the **Qwen Coder Documentation Skill** rules for maximum AI compatibility:
- **Explicit over Implicit**: Define types and imports clearly.
- **Typed Everything**: No usage of `any`.
- **Named Exports**: Prefer named exports for reliable symbol tracking.
- **Intent Comments**: Add JSDoc-style comments explaining *why* a function exists.

### Component Patterns

**Astro Components:**
```astro
---
interface Props { title: string }
const { title }: Props = Astro.props;
---
<h1>{title}</h1>
```

**React Islands:**
```tsx
'use client';
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### API Procedure:
```typescript
export const myProcedure = base
  .route({ method: 'GET', path: '/my-route' })
  .input(Schema)
  .output(Schema)
  .handler(async ({ input }) => { ... });
```

---

## 🧪 Testing & Validation

- **Type Checking**: Run `bun ts:check` for full project validation.
- **Linting**: Prettier is used for formatting with plugins for Astro and Tailwind.
- **Unused Code**: Run `bun knip` to identify dead code and dependencies.
- **API Contracts**: Run `bun run generate:contract` to sync contract JSON.

---

## 📄 License

This project is licensed under the **MIT License**.
