import { randomBytes } from 'node:crypto';

// src/server/hono-middleware/csp.ts
import { createMiddleware } from 'hono/factory';

import { permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

type CspVariables = {
  cspNonce: string;
};

// Paths that render Scalar's interactive docs
const SCALAR_PATHS = new Set(['/api/docs', '/api/rpc/orpc-docs']);

// Headers that only make sense on HTML responses
const HTML_ONLY_HEADERS: Record<string, string> = {
  'Permissions-Policy': permissionsPolicy,
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

// JSON and other non-HTML responses: nothing may load, run or embed from them
const API_CSP = "default-src 'none'; frame-ancestors 'none'; sandbox; report-to csp-endpoint";

function buildScalarCsp(nonce: string) {
  return [
    "default-src 'self'",
    // NOTE: Scalar's docs claim no unsafe-eval is needed with a nonce, but the
    // current @latest CDN bundle calls eval()/Function() unconditionally on load
    // (confirmed via CSP report + Chrome Issues panel, 2026-08). Revisit if/when
    // Scalar ships a fix — check https://github.com/scalar/scalar/issues for "unsafe-eval".
    // 'report-sha256' (Chromium only) sends the hash of each script to `csp-endpoint`.
    `script-src 'self' 'nonce-${nonce}' 'report-sample' 'report-sha256'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "font-src 'self' https:",
    'frame-src blob:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to csp-endpoint',
  ].join('; ');
}

function buildStaticCsp(nonce: string) {
  return [
    "default-src 'self'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "img-src 'self' data:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'report-sample'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to csp-endpoint',
  ].join('; ');
}

export const csp = createMiddleware<{ Variables: CspVariables }>(async (c, next) => {
  const nonce = randomBytes(16).toString('base64');
  c.set('cspNonce', nonce); // available even if this path doesn't end up using it

  await next();

  // Every response, in every environment: MIME-sniffing protection isn't HTML-specific.
  c.res.headers.set('X-Content-Type-Options', 'nosniff');

  if (envServer.PRODUCTION !== 'true') return; // no CSP in dev mode

  // Every production response. This defines the `csp-endpoint` group used by `report-to`.
  const reportUrl = new URL(envServer.PUBLIC_URL).origin + openApiBasePath + cspPath;
  c.res.headers.set('Reporting-Endpoints', `csp-endpoint="${reportUrl}"`);

  const contentType = c.res.headers.get('content-type') ?? '';

  if (!contentType.startsWith('image/')) {
    c.res.headers.set('Content-Security-Policy', API_CSP);
  }
  if (!contentType.includes('text/html')) {
    // JSON, images, text: nothing may load, run or embed from them
    c.res.headers.set('Content-Security-Policy', API_CSP);
    return;
  }

  const cspValue = SCALAR_PATHS.has(c.req.path) ? buildScalarCsp(nonce) : buildStaticCsp(nonce);
  c.res.headers.set('Content-Security-Policy', cspValue);

  for (const [key, value] of Object.entries(HTML_ONLY_HEADERS)) {
    c.res.headers.set(key, value);
  }
});
