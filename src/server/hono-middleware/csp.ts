// src/server/hono-middleware/csp.ts
import { createMiddleware } from 'hono/factory';

import { randomBytes } from 'node:crypto';

import { permissionsPolicy } from '@/lib/csp/headers';

type CspVariables = {
  cspNonce: string;
};

// Paths that render Scalar's interactive docs — need the nonce-based policy
const SCALAR_PATHS = new Set(['/api/docs', '/api/rpc/orpc-docs']);

const SHARED_HEADERS: Record<string, string> = {
  'Permissions-Policy': permissionsPolicy,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

function buildScalarCsp(nonce: string) {
  return [
    "default-src 'self'",
    // NOTE: Scalar's docs claim no unsafe-eval is needed with a nonce, but the
    // current @latest CDN bundle calls eval()/Function() unconditionally on load
    // (confirmed via CSP report + Chrome Issues panel, 2026-08). Revisit if/when
    // Scalar ships a fix — check https://github.com/scalar/scalar/issues for "unsafe-eval".
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "font-src 'self' https:",
    'frame-src blob:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    'report-uri /api/openapi/csp',
  ].join('; ');
}

function buildStaticCsp() {
  return [
    "default-src 'none'",
    "style-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    'report-uri /api/openapi/csp',
  ].join('; ');
}

export const csp = createMiddleware<{ Variables: CspVariables }>(async (c, next) => {
  const nonce = randomBytes(16).toString('base64');
  c.set('cspNonce', nonce); // available even if this path doesn't end up using it

  await next();

  const contentType = c.res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return; // JSON, images, etc. — no CSP needed

  const cspValue = SCALAR_PATHS.has(c.req.path) ? buildScalarCsp(nonce) : buildStaticCsp();
  c.res.headers.set('Content-Security-Policy', cspValue);

  for (const [key, value] of Object.entries(SHARED_HEADERS)) {
    c.res.headers.set(key, value);
  }
});
