import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { envServer, type EnvServer } from '@/lib/env/server.env';
import { prettyLogger } from '@/lib/helpers/logger';
import { openApiBasePath, rpcBasePath } from '@/lib/helpers/paths';
import { redisVps } from '@/lib/redis/client.redis.vps';
import { producer } from '@/lib/redpanda-kafka/producer';
import { rustfsClient } from '@/lib/s3/client.rustfs.vps';
import openApiHandler from '@/server/handlers/openapi.handler';
import rpcHandler from '@/server/handlers/rpc.handler';

type Env = {
  Bindings: EnvServer;
  Variables: {
    sqlite: typeof sqliteDb;
    pg: typeof pgDb;
    producer: typeof producer;
    rustfs: typeof rustfsClient;
    redis: typeof redisVps;
  };
};

export const app = new Hono<Env>({ strict: false }).basePath('/api');

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  '*',
  cors({
    origin: [envServer.PUBLIC_URL],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    exposeHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition'],
    maxAge: 600,
  })
);

app.use(prettyLogger);
// Handle HEAD requests globally to ensure they are processed correctly by all handlers
app.use('*', async (c, next) => {
  c.set('sqlite', sqliteDb);
  c.set('pg', pgDb);
  c.set('producer', producer);
  c.set('rustfs', rustfsClient);
  c.set('redis', redisVps);
  if (c.req.method !== 'HEAD') return next();

  const getRequest = new Request(c.req.url, {
    method: 'GET',
    headers: c.req.raw.headers,
    signal: c.req.raw.signal, // ✅ pass signal for abort support
  });
  const getResponse = await app.fetch(getRequest, c.env);
  return c.body(null, getResponse.status as any, {
    ...Object.fromEntries(getResponse.headers),
  });
});

// ─── RPC + OpenAPI + HEAD handler ────────────────────────────────────────────
app.use('/*', async (c, next) => {
  // ─── RPC handler ───────────────────────────────────────────────────────────
  const res = await rpcHandler.handle(c.req.raw, {
    prefix: rpcBasePath,
    context: {
      env: envServer,
      sqlite: c.get('sqlite'),
      pg: c.get('pg'),
      producer: c.get('producer'),
      rustfs: c.get('rustfs'),
      redis: c.get('redis'),
    },
  });
  if (res.matched) {
    return c.newResponse(res.response.body, res.response);
  }

  const context = {
    request: c.req.raw,
    response: c.res,
    ctx: c,
    signal: c.req.raw.signal,
    env: envServer,
    sqlite: c.get('sqlite'),
    pg: c.get('pg'),
    producer: c.get('producer'),
    rustfs: c.get('rustfs'),
    redis: c.get('redis'),
  };
  // ─── OpenAPI handler ───────────────────────────────────────────────────────
  const apiRes = await openApiHandler.handle(c.req.raw, {
    prefix: openApiBasePath,
    context,
  });
  if (apiRes.matched) {
    return c.newResponse(apiRes.response.body, apiRes.response);
  }

  await next();
});

// ─── Scalar docs ─────────────────────────────────────────────────────────────
app.get(
  '/docs',
  Scalar({
    sources: [
      { url: '/api/openapi/generate-schema', title: 'App API' },
      { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
    ],
  })
);

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
