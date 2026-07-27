// src/fetch.ts
import { actions, middleware, pages, sessions } from 'astro/hono';
import { Hono } from 'hono';

import { app as apiApp } from '@/server/app';

const root = new Hono();

root.use(sessions());
root.use(actions());
root.use(middleware());

root.route('/', apiApp);

root.use(pages());

export default root;
