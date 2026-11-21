// src/middleware.ts
import { randomBytes } from 'node:crypto';

import { defineMiddleware } from 'astro:middleware';

import { buildCspWithNonce, cspStrict, permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath } from '@/lib/helpers/paths/api.paths';
import { ErrorCodeSchema } from '@/lib/schemas/errors/page.errors';

const IS_PROD = envServer.PRODUCTION === 'true';
const ERROR_PAGE = '/error-page';

// Hono (/api) and TanStack (/app) set their own security headers
const NON_ASTRO_PREFIXES = ['/api', '/app'] as const;

// Must match the `report-to` group used in the policies (see headers.ts)
const REPORT_GROUP = 'default';

/**
 * ============================================================
 * HEADER SETS: each defined once, applied by setHeaders()
 * ============================================================
 */
const BASE_HEADERS: Record<string, string> = {
  'Permissions-Policy': permissionsPolicy,
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

// HTML that carries a per-request nonce must never be cached
const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
  Pragma: 'no-cache',
};

// A bad or missing PUBLIC_URL must not crash the middleware (or the Docker build)
const REPORTING_ENDPOINTS = (() => {
  if (!IS_PROD) return null;
  try {
    const url = `${new URL(envServer.PUBLIC_URL).origin}${envServer.PUBLIC_OPEN_API_BASE_PATH + cspPath}`;
    return `${REPORT_GROUP}="${url}"`;
  } catch {
    return null;
  }
})();

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */
const hasPrefix = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
const hasAnyPrefix = (path: string, prefixes: readonly string[]) =>
  prefixes.some((prefix) => hasPrefix(path, prefix));

const setHeaders = (response: Response, headers: Record<string, string>) => {
  for (const [name, value] of Object.entries(headers)) {
    response.headers.set(name, value);
  }
};

// Vite dev modules and built assets keep the original behavior: no nosniff
const isAssetRequest = (path: string) =>
  path.startsWith('/_astro/') ||
  path.startsWith('/src/') ||
  path.endsWith('.css') ||
  path.endsWith('.js');

/**
 * ============================================================
 * MIDDLEWARE
 * ============================================================
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const rawPathname = new URL(context.request.url).pathname;

  // Hono owns /api/* (including its JSON 404/405): never touch those responses
  if (hasPrefix(pathname, '/api') || hasPrefix(rawPathname, '/api')) {
    return next();
  }

  // The nonce must exist BEFORE rendering, so Astro.locals.cspNonce is available in layouts
  const nonce = randomBytes(16).toString('base64');
  context.locals.cspNonce = nonce;

  const response = await next();

  // 1. Error statuses go to the shared error page
  if (pathname !== ERROR_PAGE && ErrorCodeSchema.safeParse(String(response.status)).success) {
    return context.redirect(`${ERROR_PAGE}?code=${response.status}`, 302);
  }

  // 2. Security headers on every response
  setHeaders(response, BASE_HEADERS);
  if (!isAssetRequest(pathname)) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  if (REPORTING_ENDPOINTS) {
    response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);
  }

  const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;
  if (!isHtml) return response;

  // 3. No caching for server-rendered HTML (it contains the nonce)
  if (!context.isPrerendered) {
    setHeaders(response, NO_STORE_HEADERS);
  }

  // 4. CSP: Astro-rendered HTML in production
  //    Prerendered pages have no runtime nonce in their HTML, so they get the hash-only policy.
  //    NOTE: for prerendered pages this header is only set at BUILD time. The adapter serves the
  //    saved HTML without running this middleware, so it never reaches the browser.
  if (IS_PROD && !hasAnyPrefix(pathname, NON_ASTRO_PREFIXES)) {
    response.headers.set(
      'Content-Security-Policy',
      context.isPrerendered ? cspStrict : buildCspWithNonce(nonce)
    );
  }

  return response;
});
