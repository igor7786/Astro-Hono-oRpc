import { createMiddleware } from 'hono/factory';

// Handle OPTIONS requests globally to ensure they are processed correctly by all handlers
const trailingSlash = createMiddleware(async (c, next) => {
  const url = new URL(c.req.url);
  if (url.pathname.endsWith('/')) {
    return c.redirect(url.pathname.slice(0, -1), 301);
  }
  await next();
});

export default trailingSlash;
