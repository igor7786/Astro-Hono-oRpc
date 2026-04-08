import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Scalar } from '@scalar/hono-api-reference';
import rpcHandler from '@server/handlers/rpc.handler';
import openApiHandler from '@server/handlers/openapi.handler';
import type { envServer } from '@/lib/env/server.env';
import { generateLLMsMarkdown } from '@server/llms';
import { createHtmlFromOpenApi } from '@scalar/openapi-to-markdown';

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
  // 1. Get OpenAPI schema from your handler
  const { response } = await openApiHandler.handle(
    new Request('http://internal/api/openapi/generate-schema'),
    {
      prefix: '/api/openapi',
      context: { env: c.env },
    }
  );
  if (!response) {
    throw new Error('OpenAPI handler did not return a response');
  }

  // 2. Parse JSON
  const openApiDoc = await response.json();

  // 3. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);

  // 4. Return as plain text
  return c.text(markdown);
});

app.get('/html.llms', async (c) => {
  // 1. Get OpenAPI schema from your handler
  const { response } = await openApiHandler.handle(
    new Request('http://internal/api/openapi/generate-schema'),
    {
      prefix: '/api/openapi',
      context: { env: c.env },
    }
  );
  if (!response) {
    throw new Error('OpenAPI handler did not return a response');
  }

  // 2. Parse JSON
  const openApiDoc = await response.json();

  // 3. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);

  // 4. Return as HTML
  return c.html(
    `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <title>Scalar Galaxy</title>
  <!-- Basic styling for semantic HTML tags (optional) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
</head>
<body>
  <main class="container">
    ${markdown}
  </main>
</body>
</html>`
  );
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
