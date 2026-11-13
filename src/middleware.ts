import { randomBytes } from 'node:crypto';

import { defineMiddleware } from 'astro:middleware';

import { buildDynamicCsp, cspStatic, permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';
import { ErrorCodeSchema } from '@/lib/shared/schemas/errors/page.errors';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isStaticBlog = pathname.startsWith('/playground/blog');
  const isDynamicPlayground = pathname.startsWith('/playground') && !isStaticBlog;

  // Generate nonce before next() so Astro pages & React islands can read Astro.locals.cspNonce
  const nonce = isDynamicPlayground ? randomBytes(16).toString('base64') : undefined;
  if (nonce) {
    context.locals.cspNonce = nonce;
  }

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
   * SECURITY HEADERS — every response: HTML, API, static, APP, etc.
   * ============================================================
   */
  response.headers.set('Permissions-Policy', permissionsPolicy);
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  if (envServer.PRODUCTION === 'true') {
    const endpointUrl = `${new URL(envServer.PUBLIC_URL).origin}${openApiBasePath + cspPath}`;
    response.headers.set('Reporting-Endpoints', `default="${endpointUrl}"`);
  }

  // Detect Vite development assets or internal source file requests
  const isDevAsset =
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/src/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js');

  // Only enforce strict MIME sniffing if it is NOT a Vite dev module
  if (!isDevAsset) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  const isStaticOrApiOrApp =
    context.isPrerendered ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/app/');

  const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;

  /**
   * ============================================================
   * CACHE CONTROL — only dynamically-rendered HTML
   * ============================================================
   */
  if (!isStaticOrApiOrApp && isHtml && isStaticBlog) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    response.headers.set('Pragma', 'no-cache');
  }

  /**
   * ============================================================
   * CSP — Static (/playground/blog) vs Dynamic SSR (/playground/*)
   * ============================================================
   */
  if (
    envServer.PRODUCTION === 'true' &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/app/') &&
    isHtml
  ) {
    if (isStaticBlog) {
      response.headers.set('Content-Security-Policy', cspStatic);
    } else if (isDynamicPlayground && nonce) {
      response.headers.set('Content-Security-Policy', buildDynamicCsp(nonce));
    }
  }

  return response;
});
