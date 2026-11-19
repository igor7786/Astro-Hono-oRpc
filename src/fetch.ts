// src/fetch.ts
import startHandler from '@tanstack/react-start/server-entry';

import { actions, middleware, pages, sessions } from 'astro/hono';
import { Hono } from 'hono';

import { app as apiApp } from '@/server/app';

const root = new Hono();

// 1. Mount Hono API FIRST so Astro's middleware/pages never intercept /api 404s
root.route('/', apiApp);

// 2. Astro middlewares & pages (only for non-/api routes)
root.use(sessions());
root.use(actions());
root.use(middleware());

// Astro owns these prefixes; TanStack Start owns everything else
const astroPrefixes = ['/playground', '/_astro', '/_image', '/_server-islands'];

root.all('/*', (c, next) => {
  const { pathname } = new URL(c.req.url);
  const isAstro = astroPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isAstro) return next();
  return startHandler.fetch(c.req.raw);
});

root.use(pages());

export default root;
