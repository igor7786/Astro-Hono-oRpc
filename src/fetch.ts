// src/fetch.ts
// src/fetch.ts
import { actions, middleware, pages, sessions } from 'astro/hono';
import { Hono } from 'hono';

import { app as apiApp } from '@/server/app';

const root = new Hono();

// Your existing Hono app handles /api/*
// Your existing /api/* Hono app
root.route('/', apiApp);

// Astro pipeline — order matters
root.use(sessions()); // ← session storage
root.use(actions()); // ← Astro actions
root.use(middleware()); // ← locals, i18n, etc.
root.use(pages()); // ← page renderer (must be last)

export default root;
