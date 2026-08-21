import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
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
    neon: typeof neonDb;
    producer: typeof producer;
    rustfs: typeof rustfsClient;
    redis: typeof redisVps;
  };
};

// GLOBAL PATHS
export const app = new Hono<Env>({ strict: false }).basePath('/api');

// Handle HEAD requests globally to ensure they are processed correctly by all handlers
app.use('*', async (c, next) => {
  c.set('sqlite', sqliteDb);
  c.set('neon', neonDb);
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

// Handle OPTIONS requests globally to ensure they are processed correctly by all handlers
app.use('*', async (c, next) => {
  await next();
  const vary = c.res.headers.get('Vary');
  if (vary && vary.includes('Origin') && !vary.includes('Accept')) {
    c.res.headers.set('Vary', `${vary}, Accept`);
  }
});

// ─── CORS ────────────────────────────────────────────────────────────────────
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

// ─── RPC + OpenAPI + HEAD handler ────────────────────────────────────────────
app.use('/*', async (c, next) => {
  // ─── RPC handler ───────────────────────────────────────────────────────────
  const res = await rpcHandler.handle(c.req.raw, {
    prefix: rpcBasePath,
    context: {
      env: envServer,
      sqlite: c.get('sqlite'),
      pg: c.get('pg'),
      neon: c.get('neon'),
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
    neon: c.get('neon'),
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

// ─── CSP report handler ──────────────────────────────────────────────────────────────────────
app.post('/csp-report', async (c) => {
  const body = await c.req.text();
  try {
    const report = JSON.parse(body);
    console.warn('[CSP Violation]', JSON.stringify(report, null, 2));
  } catch {
    console.warn('[CSP Violation - raw]', body);
  }
  return c.body(null, 204);
});

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
