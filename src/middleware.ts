import { randomBytes } from 'node:crypto';

import { defineMiddleware } from 'astro:middleware';

import { buildCspWithNonce, cspStrict, permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath } from '@/lib/helpers/paths/api.paths';
import { ErrorCodeSchema } from '@/lib/schemas/errors/page.errors';

const isProd = envServer.PRODUCTION === 'true';
const reportingEndpoint = isProd
  ? `${new URL(envServer.PUBLIC_URL).origin}${envServer.PUBLIC_OPEN_API_BASE_PATH}${cspPath}`
  : null;

const DEV_ASSET_PREFIXES = ['/_astro/', '/src/'];
const DEV_ASSET_EXTENSIONS = ['.css', '.js'];

const hasPrefix = (path: string, prefix: string): boolean =>
  path === prefix || path.startsWith(`${prefix}/`);

const isDevAsset = (path: string): boolean =>
  DEV_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
  DEV_ASSET_EXTENSIONS.some((ext) => path.endsWith(ext));

const isHtmlResponse = (headers: Headers): boolean =>
  headers.get('content-type')?.includes('text/html') ?? false;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const rawPathname = new URL(context.request.url).pathname;

  // Hono owns /api/* (including its JSON 404/405): never touch those responses
  if (hasPrefix(pathname, '/api') || hasPrefix(rawPathname, '/api')) {
    return next();
  }

  // Generate a runtime nonce only for SSR requests; prerendered pages use hash-only CSP
  const nonce = context.isPrerendered ? undefined : randomBytes(16).toString('base64');
  context.locals.cspNonce = nonce;

  const response = await next();

  // Redirect known error status codes to the custom error page
  if (pathname !== '/error-page' && ErrorCodeSchema.safeParse(String(response.status)).success) {
    return context.redirect(`/error-page?code=${response.status}`, 302);
  }

  const { headers } = response;

  // ─── Baseline Security Headers ─────────────────────────────────────────────
  headers.set('Permissions-Policy', permissionsPolicy);
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');

  if (!isDevAsset(pathname)) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }

  if (reportingEndpoint) {
    headers.set('Reporting-Endpoints', `default="${reportingEndpoint}"`);
  }

  // ─── Cache-Control + CSP: HTML pages under /playground only ────────────────
  if (hasPrefix(pathname, '/playground') && isHtmlResponse(headers)) {
    if (!context.isPrerendered) {
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
      headers.set('Pragma', 'no-cache');
    }

    if (isProd) {
      headers.set('Content-Security-Policy', nonce ? buildCspWithNonce(nonce) : cspStrict);
    }
  }

  return response;
});
