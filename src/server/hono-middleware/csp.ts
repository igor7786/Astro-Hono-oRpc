import { randomBytes } from 'node:crypto';

import { createMiddleware } from 'hono/factory';

import { permissionsPolicy } from '@/lib/csp/headers';
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

type CspVariables = {
  cspNonce: string;
};

// Match Scalar doc routes regardless of trailing slash
const isScalarPath = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, '');
  return clean === '/api/docs' || clean === '/api/rpc/orpc-docs';
};

const HTML_ONLY_HEADERS: Record<string, string> = {
  'Permissions-Policy': permissionsPolicy,
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

const API_CSP = `default-src 'none'; frame-ancestors 'none'; sandbox; report-uri ${openApiBasePath + cspPath}; report-to csp-endpoint`;

function buildScalarCsp(nonce: string) {
  return [
    "default-src 'self'",
    // Self-hosted Scalar bundle (no cdn.jsdelivr.net gadget host)
    `script-src 'self' 'nonce-${nonce}' 'report-sample' 'report-sha256'`,
    `style-src-elem 'self' 'nonce-${nonce}' 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "font-src 'self' data:",
    'frame-src blob:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to default',
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
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'report-sample'`,
    `style-src-elem 'self' 'nonce-${nonce}' 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to default',
  ].join('; ');
}

export const csp = createMiddleware<{ Variables: CspVariables }>(async (c, next) => {
  const nonce = randomBytes(16).toString('base64');
  c.set('cspNonce', nonce);

  await next();

  c.res.headers.set('X-Content-Type-Options', 'nosniff');

  if (envServer.PRODUCTION !== 'true') return;

  const reportUrl = new URL(envServer.PUBLIC_URL).origin + openApiBasePath + cspPath;
  c.res.headers.set('Reporting-Endpoints', `csp-endpoint="${reportUrl}"`);

  const contentType = c.res.headers.get('content-type') ?? '';

  if (!contentType.includes('text/html')) {
    c.res.headers.set('Content-Security-Policy', API_CSP);
    return;
  }

  // Prevent caching nonce-bearing HTML responses
  c.res.headers.set('Cache-Control', 'no-store, private');

  const cspValue = isScalarPath(c.req.path) ? buildScalarCsp(nonce) : buildStaticCsp(nonce);
  c.res.headers.set('Content-Security-Policy', cspValue);

  for (const [key, value] of Object.entries(HTML_ONLY_HEADERS)) {
    c.res.headers.set(key, value);
  }
});
