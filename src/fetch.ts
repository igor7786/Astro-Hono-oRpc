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
root.all('/app', (c) => startHandler.fetch(c.req.raw));
root.all('/app/*', (c) => startHandler.fetch(c.req.raw));

root.use(pages());

export default root;
