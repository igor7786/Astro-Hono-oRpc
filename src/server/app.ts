import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { envServer, type EnvServer } from '@/lib/env/server.env';
import { prettyLogger } from '@/lib/helpers/logger';
import { openApiBasePath, rpcBasePath } from '@/lib/helpers/paths';
import openApiHandler from '@/server/handlers/openapi.handler';
import rpcHandler from '@/server/handlers/rpc.handler';
import { llmsHtml } from '@/server/seo/html.handler';
import { og } from '@/server/seo/og.handler';
import { llmsTxt } from '@/server/seo/txt.handler';

type Env = { Bindings: EnvServer };

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
    context: { env: c.env },
  });
  if (res.matched) {
    return c.newResponse(res.response.body, res.response);
  }

  const context = {
    request: c.req.raw,
    response: c.res,
    ctx: c,
    signal: c.req.raw.signal,
    env: c.env,
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

// ─── SEO / LLM routes ────────────────────────────────────────────────────────
app.route('/', llmsTxt);
app.route('/', llmsHtml);
app.route('/', og);

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
