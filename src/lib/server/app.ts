import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Scalar } from '@scalar/hono-api-reference';
import rpcHandler from '@server/handlers/rpc.handler';
import openApiHandler from '@server/handlers/openapi.handler';
import type { envServer } from '@/lib/env/server.env';
import { ogHandler } from './seo/og.handler';
import { htmlLlmsHandler } from '@server/seo/llms.handler';
import { llmsTxtHandler } from '@server/seo/txt.handler';

type Env = { Bindings: typeof envServer };

export const app = new Hono<Env>().basePath('/api');

// ─── Global middleware ────────────────────────────────────────────────────────
app.use('*', logger());

// ─── oRPC handler ─────────────────────────────────────────────────────────────
app.use('/rpc/*', async (c, next) => {
  // ✅ get signal directly from the incoming request
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: '/api/rpc',
    context: { env: c.env },
  });
  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

// ─── OpenAPI handler ─────────────────────────────────────────────────────────────
app.use('/openapi/*', async (c, next) => {
  const context = {
    request: c.req.raw,
    response: c.res,
    ctx: c,
    signal: c.req.raw.signal,
    env: c.env,
  };

  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: '/api/openapi',
    context,
  });
  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

// ─── Scalar docs (all APIs in one UI) ────────────────────────────────────────
app.get(
  '/docs',
  Scalar({
    sources: [
      { url: '/api/openapi/generate-schema', title: 'App API' },
      { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
    ],
  })
);

// Markdown ──────────────────────────────────────────────────────────────────────────────
app.get('/llms.txt', async (c) => {
  const markdown = await llmsTxtHandler(openApiHandler, c.env);

  return c.text(markdown, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
});

app.get('/llms.html', async (c) => {
  const html = await htmlLlmsHandler(openApiHandler, c.env);

  return c.html(html);
});
// ─── Satori OG ────────────────────────────────────────

app.get('/og', async (c) => {
  const rawTitle = c.req.query('title') ?? 'Default Title';

  // 🔒 sanitize input
  const title = String(rawTitle).slice(0, 80);

  // ⚡ cache check
  // if (cache.has(title)) {
  //   return c.body(cache.get(title)!, 200, {
  //     'Content-Type': 'image/png',
  //     'Cache-Control': 'public, max-age=31536000, immutable',
  //   });
  // }

  // 📦 load local font (FAST + RELIABLE)

  const image = await ogHandler(title);

  // // 💾 store in cache
  // cache.set(title, buffer);

  // 🚀 response
  return c.body(image, 200, {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  });
});

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
// /api/llms.txt                   → Markdown (for Ai)
// /api/html.llms                  → HTML (for browsers)
// /api/og                        → Open Graph image
