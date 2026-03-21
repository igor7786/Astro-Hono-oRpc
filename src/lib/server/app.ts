import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Scalar } from '@scalar/hono-api-reference';
import handler from '@server/open-api-handler/handler';

export const app = new Hono().basePath('/api');

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  '*',
  cors({
    origin: 'http://localhost:4321',
    credentials: true, // ← required for cookies
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use('*', logger());

// ─── oRPC handler ─────────────────────────────────────────────────────────────
app.use('/rpc/*', async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/api/rpc',
    context: {
      request: c.req.raw,
      response: c.res,
      ctx: c,
    },
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

// ─── Scalar docs (all APIs in one UI) ────────────────────────────────────────
app.get(
  '/docs',
  Scalar({
    pageTitle: 'My API Docs',
    sources: [
      { url: '/api/rpc/generate-schema', title: 'App API' },
      { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
    ],
  })
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;

// ## URLs you get
// /api/rpc/*                      → oRPC procedures
// /api/rpc/orpc-docs              → Scalar (oRPC only)
// /api/rpc/generate-schema        → raw OpenAPI spec
// /api/docs                       → Scalar (all APIs combined)
// /api/health                     → health check
// /api/auth/*                     → Better Auth (when added)
