import { Hono } from 'hono';

import { prettyLogger } from '@/lib/helpers/logger';
import corsMiddleware from '@/server/hono-middleware/cors';
import { csp } from '@/server/hono-middleware/csp';
import type { Env } from '@/server/hono-middleware/env';
import head from '@/server/hono-middleware/head';
import injectClients from '@/server/hono-middleware/inject.clients';
import allowedMethods from '@/server/hono-middleware/methods';
import options from '@/server/hono-middleware/options';
import orpcMiddleware from '@/server/hono-middleware/orpc';
import scalar from '@/server/hono-middleware/scalar';

// GLOBAL PATHS
export const app = new Hono<Env>({ strict: false }).basePath('/api');
app.use('*', csp);
app.get('/docs', scalar);
// Inject clients as Sqlite, Redis, PG and so on ...
app.use('*', injectClients);
// Handle HEAD requests globally to ensure they are processed correctly by all handlers
app.use('*', head);

// Handle OPTIONS requests globally to ensure they are processed correctly by all handlers
app.use('*', options);

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use('*', corsMiddleware);

app.use(prettyLogger);
// ─── RPC + OpenAPI + HEAD handler ────────────────────────────────────────────
app.use('/*', orpcMiddleware);

// ─── Scalar docs ─────────────────────────────────────────────────────────────
// app.get('/docs', scalar);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', async (c) => c.json({ status: 'ok' }));

// ─── Allow all methods ───────────────────────────────────────────────────────
app.all('*', allowedMethods);

export default app;

// ## URLs you get
// /api/rpc/*                      → oRPC procedures
// /api/rpc/orpc-docs              → Scalar (oRPC only)
// /api/rpc/generate-schema        → raw OpenAPI spec
// /api/docs                       → Scalar (all APIs combined)
// /api/health                     → health check
// /api/auth/*                     → Better Auth (when added)
// /api/llms.txt                   → Markdown (for Ai)
// /api/html.llms                  → HTML (for browsers)
// /api/og                        → Open Graph image
