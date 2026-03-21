import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip static + API
  if (context.isPrerendered || pathname.startsWith('/_astro/') || pathname.startsWith('/api/')) {
    return next();
  }

  const response = await next();

  // Only affect HTML pages
  if (response.headers.get('content-type')?.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    response.headers.set('Pragma', 'no-cache');
  }

  return response;
});
