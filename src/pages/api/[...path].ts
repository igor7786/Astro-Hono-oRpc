import type { APIRoute } from 'astro';

import { envServer } from '@/lib/env/server.env';
import app from '@/server/app';

export const ALL: APIRoute = async ({ request }) => {
  return await app.fetch(request, envServer);
};
