import { createMiddleware } from 'hono/factory';

// Handle OPTIONS requests globally to ensure they are processed correctly by all handlers
const options = createMiddleware(async (c, next) => {
  await next();
  const vary = c.res.headers.get('Vary');
  if (vary && vary.includes('Origin') && !vary.includes('Accept')) {
    c.res.headers.set('Vary', `${vary}, Accept`);
  }
});

export default options;
