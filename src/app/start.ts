import { createMiddleware, createStart } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';

import {
  buildCsp,
  CSP_REPORT_ONLY,
  createNonce,
  cspEnabled,
  permissionsPolicy,
} from '@app/middleware/security.server';

const securityMiddleware = createMiddleware().server(async ({ next, request }) => {
  const nonce = createNonce();

  // Every response (HTML, server functions, assets)
  setResponseHeader('Permissions-Policy', permissionsPolicy);
  setResponseHeader('X-Content-Type-Options', 'nosniff');
  setResponseHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  setResponseHeader('X-Frame-Options', 'DENY');

  // HTML documents only
  const wantsHtml = request.headers.get('accept')?.includes('text/html') ?? false;
  if (wantsHtml) {
    setResponseHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    setResponseHeader('Pragma', 'no-cache');

    if (cspEnabled()) {
      setResponseHeader(
        CSP_REPORT_ONLY ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
        buildCsp(nonce)
      );
    }
  }

  // The nonce travels with the request, so the router can read it
  return next({ context: { nonce } });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityMiddleware],
}));
