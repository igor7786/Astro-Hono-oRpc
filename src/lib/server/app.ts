import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
export const app = new Hono().basePath('/api');

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  '*',
  cors({
    origin: import.meta.env.PUBLIC_APP_URL ?? 'http://localhost:4321',
    credentials: true, // ← required for cookies
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use('*', logger());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;

// ## URLs you get

// /api/health                     → health check
