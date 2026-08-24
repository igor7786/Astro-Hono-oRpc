import { defineMiddleware } from 'astro:middleware';

import { csp, permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { ErrorCodeSchema } from '@/lib/shared/schemas/errors/page.errors';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const response = await next();

  /**
   * ============================================================
   * REDIRECT TO ERROR PAGE
   * ============================================================
   */

  const status = String(response.status);
  const parsed = ErrorCodeSchema.safeParse(status);

  const isApi = pathname.startsWith('/api/');
  const isErrorPage = pathname === '/error-page';

  if (parsed.success && !isApi && !isErrorPage) {
    return context.redirect(`/error-page?code=${status}`, 302);
  }

  /**
   * ============================================================
   * SECURITY HEADERS — every response: HTML, API, static
   * ============================================================
   */

  response.headers.set('Permissions-Policy', permissionsPolicy);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  const isStaticOrApi =
    context.isPrerendered || pathname.startsWith('/_astro/') || pathname.startsWith('/api/');

  const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;

  /**
   * ============================================================
   * CACHE CONTROL — only dynamically-rendered HTML
   * ============================================================
   */

  if (!isStaticOrApi && isHtml) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');

    response.headers.set('Pragma', 'no-cache');
  }

  /**
   * ============================================================
   * CSP — Astro-rendered HTML only, never /api/*
   * ============================================================
   */

  if (envServer.PRODUCTION === 'true' && csp && !pathname.startsWith('/api/') && isHtml) {
    response.headers.set('Content-Security-Policy', csp);
  }

  return response;
});
