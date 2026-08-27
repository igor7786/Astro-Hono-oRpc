import { createMiddleware } from 'hono/factory';

import { app } from '@/server/app';

// Handle HEAD requests globally to ensure they are processed correctly by all handlers
const head = createMiddleware(async (c, next) => {
  if (c.req.method !== 'HEAD') return next();

  const getRequest = new Request(c.req.url, {
    method: 'GET',
    headers: c.req.raw.headers,
    signal: c.req.raw.signal, // ✅ pass signal for abort support
  });
  const getResponse = await app.fetch(getRequest, c.env);
  return c.body(null, getResponse.status as any, {
    ...Object.fromEntries(getResponse.headers),
  });
});

export default head;
