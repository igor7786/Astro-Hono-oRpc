// src/fetch.ts
import startHandler from '@tanstack/react-start/server-entry';

import { actions, middleware, pages, sessions } from 'astro/hono';
import { Hono } from 'hono';

import { app as apiApp } from '@/server/app';

const root = new Hono();

// API first: its terminal catch-all means nothing below runs for /api/*

root.use(sessions());
root.use(actions());
root.use(middleware());

const astroPrefixes = ['/playground', '/_astro', '/_image', '/_server-islands'];
root.route('/', apiApp);

root.all('/*', (c, next) => {
  const { pathname } = new URL(c.req.url);

  // Belt and braces: TanStack must never answer /api
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return c.json({ error: 'Not Found', path: pathname }, 404);
  }

  const isAstro = astroPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isAstro) return next();
  return startHandler.fetch(c.req.raw);
});

root.use(pages());

export default root;
