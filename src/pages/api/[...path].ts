import type { APIRoute } from 'astro';

import app from '@/server/app';

export const ALL: APIRoute = async ({ request }) => {
  return await app.fetch(request);
};
