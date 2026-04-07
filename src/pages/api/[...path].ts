// src/pages/api/[...path].ts
import type { APIRoute } from 'astro';
import app from '@server/app';
import { envServer } from '@/lib/env/server.env';
import { envClient } from '@/lib/env/client.env';

export const ALL: APIRoute = async ({ request }) => {
  console.log('API Request:', request.url);
  console.log('Server Environment Variables:', envServer);
  console.log('Client Environment Variables:', envClient);
  return await app.fetch(request);
};
