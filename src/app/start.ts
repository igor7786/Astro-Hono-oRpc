import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';

import {
  buildCsp,
  createNonce,
  cspEnabled,
  getReportEndpoint,
  permissionsPolicy,
} from '@app/middleware/security.server';

/**
 * Security headers, cache control, Reporting-Endpoints, and a per-request CSP nonce.
 * The nonce is passed on through the request context to the router (see router.tsx).
 */
const securityMiddleware = createMiddleware().server(async ({ next, request }) => {
  const nonce = createNonce();

  // Dynamically extract the incoming request origin for the modern reporting endpoint
  // / Update this line inside your securityMiddleware block:
  const requestUrl = new URL(request.url);

  // Force https on production domains, otherwise fallback to the current request schema
  const protocol = requestUrl.hostname.includes('localhost') ? requestUrl.protocol : 'https:';
  const reportUriFullUrl = `${protocol}//${requestUrl.host}${getReportEndpoint()}`;

  // This guarantees output: default="https://fast-web-tech.co.uk..."
  setResponseHeader('Reporting-Endpoints', `default="${reportUriFullUrl}"`);

  // Every response: HTML, server functions, assets
  setResponseHeader('Permissions-Policy', permissionsPolicy);
  setResponseHeader('X-Content-Type-Options', 'nosniff');
  setResponseHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  setResponseHeader('X-Frame-Options', 'DENY');

  // Clean up reporting warnings by supplying the modern reporting group mapping
  setResponseHeader('Reporting-Endpoints', `default="${reportUriFullUrl}"`);

  // HTML documents only
  const wantsHtml = request.headers.get('accept')?.includes('text/html') ?? false;

  if (wantsHtml) {
    setResponseHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    setResponseHeader('Pragma', 'no-cache');

    if (cspEnabled) {
      setResponseHeader('Content-Security-Policy', buildCsp(nonce));
    }
  }

  return next({ context: { nonce } });
});

/**
 * CSRF protection for server functions only. Hono's /api routes keep their own CSRF middleware.
 * `origin` is used only when a request has an Origin header but no Sec-Fetch-Site header.
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
  origin: async (value) => {
    const { envServer } = await import('@/lib/env/server.env');
    return value === new URL(envServer.PUBLIC_URL).origin;
  },
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityMiddleware, csrfMiddleware],
}));
