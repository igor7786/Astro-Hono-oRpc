import { createMiddleware } from 'hono/factory';

// Ensures caches (e.g. NPMplus) that already vary on Origin also vary on Accept,
// so a JSON-requesting client and an HTML-requesting client don't get served
// each other's cached response for the same path.
const varyHardening = createMiddleware(async (c, next) => {
  await next();
  const vary = c.res.headers.get('Vary');
  if (vary && vary.includes('Origin') && !vary.includes('Accept')) {
    c.res.headers.set('Vary', `${vary}, Accept`);
  }
});

export default varyHardening;
