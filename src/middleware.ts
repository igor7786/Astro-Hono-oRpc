import { randomBytes } from 'node:crypto';

import { defineMiddleware } from 'astro:middleware';

import { buildCspWithNonce, cspStrict, permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath } from '@/lib/helpers/paths/api.paths';
import { ErrorCodeSchema } from '@/lib/shared/schemas/errors/page.errors';

const hasPrefix = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const rawPathname = new URL(context.request.url).pathname;

  // Hono owns /api/* (including its JSON 404/405): never touch those responses
  if (hasPrefix(pathname, '/api') || hasPrefix(rawPathname, '/api')) {
    return next();
  }

  // Nonce must exist BEFORE rendering so Astro.locals.cspNonce is available in layouts
  const nonce = randomBytes(16).toString('base64');
  context.locals.cspNonce = nonce;

  const response = await next();

  // Error statuses go to the error page
  if (pathname !== '/error-page' && ErrorCodeSchema.safeParse(String(response.status)).success) {
    return context.redirect(`/error-page?code=${response.status}`, 302);
  }

  const { headers } = response;
  const isProd = envServer.PRODUCTION === 'true';

  // ─── Security headers ──────────────────────────────────────────────────────
  headers.set('Permissions-Policy', permissionsPolicy);
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');

  if (isProd) {
    const endpointUrl = `${new URL(envServer.PUBLIC_URL).origin}${envServer.PUBLIC_OPEN_API_BASE_PATH + cspPath}`;
    headers.set('Reporting-Endpoints', `default="${endpointUrl}"`);
  }

  // Skip strict MIME sniffing for Vite dev modules / source files
  const isDevAsset =
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/src/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js');

  if (!isDevAsset) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }

  // ─── Cache-Control + CSP: HTML pages under /playground only ────────────────
  const isPlaygroundHtml =
    hasPrefix(pathname, '/playground') && (headers.get('content-type')?.includes('text/html') ?? false);

  if (isPlaygroundHtml) {
    if (!context.isPrerendered) {
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
      headers.set('Pragma', 'no-cache');
    }

    if (isProd) {
      // Prerendered pages have no runtime nonce in their HTML, so use hash-only cspStrict
      headers.set(
        'Content-Security-Policy',
        context.isPrerendered ? cspStrict : buildCspWithNonce(nonce)
      );
    }
  }

  return response;
});
