import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const response = await next();

  // Security headers — every response: HTML, API, static
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), hid=(), serial=(), midi=()'
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  // Cache-Control — only dynamically-rendered HTML, not static/prerendered/API
  const isStaticOrApi =
    context.isPrerendered || pathname.startsWith('/_astro/') || pathname.startsWith('/api/');

  if (!isStaticOrApi && response.headers.get('content-type')?.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    response.headers.set('Pragma', 'no-cache');
  }

  return response;
});
