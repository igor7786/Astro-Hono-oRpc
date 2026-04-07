// src/pages/api/[...path].ts
import type { APIRoute } from 'astro';
import app from '@server/app';
import { envServer } from '@/lib/env/server.env';

export const ALL: APIRoute = async ({ request }) => {
  return await app.fetch(request, envServer);
};
