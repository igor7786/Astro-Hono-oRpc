// src/fetch.ts
import startHandler from '@tanstack/react-start/server-entry';

import { actions, middleware, pages, sessions } from 'astro/hono';
import { Hono } from 'hono';

import { app as apiApp } from '@/server/app';

const root = new Hono();

root.use(sessions());
root.use(actions());
root.use(middleware());

root.route('/', apiApp);

// TanStack Start owns everything under its router basepath ('app' in astro.config)
// root.all('/', (c) => startHandler.fetch(c.req.raw));
// root.all('*', (c) => startHandler.fetch(c.req.raw));

// Astro owns these prefixes; TanStack Start owns everything else
const astroPrefixes = ['/playground', '/_astro', '/_image', '/_server-islands', '/error-page'];

root.all('app/*', (c, next) => {
  const { pathname } = new URL(c.req.url);
  const isAstro = astroPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isAstro) return next();
  return startHandler.fetch(c.req.raw);
});

root.use(pages());

export default root;
