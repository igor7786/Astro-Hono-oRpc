import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';

import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { type EnvServer } from '@/lib/env/server.env';
import { prettyLogger } from '@/lib/helpers/logger';
import { redisVps } from '@/lib/redis/client.redis.vps';
import { producer } from '@/lib/redpanda-kafka/producer';
import { rustfsClient } from '@/lib/s3/client.rustfs.vps';
import corsMiddleware from '@/server/hono-middleware/cors';
import head from '@/server/hono-middleware/head';
import injectClients from '@/server/hono-middleware/inject.clients';
import options from '@/server/hono-middleware/options';
import orpcMiddleware from '@/server/hono-middleware/orpc';
import scalar from '@/server/hono-middleware/scalar';

type Env = {
  Bindings: EnvServer;
  Variables: {
    sqlite: typeof sqliteDb;
    pg: typeof pgDb;
    neon: typeof neonDb;
    producer: typeof producer;
    rustfs: typeof rustfsClient;
    redis: typeof redisVps;
  };
};

// GLOBAL PATHS
export const app = new Hono<Env>({ strict: false }).basePath('/api');
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
app.get('/docs', scalar);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok' }));

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

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
