import { scriptHashes, styleHashes } from '@/lib/csp/hashes';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

const joinTokens = (...tokens: string[]) => tokens.filter(Boolean).join(' ');

const buildCsp = (scriptSources: string[], styleDirectives: string[]) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    joinTokens("script-src 'self'", ...scriptSources, "'report-sample'"),
    ...styleDirectives,
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to default',
  ].join('; ');

/**
 * Static hash-based CSP for prerendered pages (no runtime nonce available)
 */
export const cspStrict = buildCsp(
  [scriptHashes],
  [joinTokens("style-src-elem 'self'", styleHashes), "style-src-attr 'unsafe-inline'"]
);

/**
 * Per-request nonce + hash CSP for dynamic SSR pages
 */
export const buildCspWithNonce = (nonce: string) =>
  buildCsp(
    [`'nonce-${nonce}'`, scriptHashes],
    [
      joinTokens("style-src-elem 'self'", `'nonce-${nonce}'`, styleHashes),
      "style-src-attr 'unsafe-inline'",
    ]
  );

/**
 * ============================================================
 * PERMISSIONS-POLICY — static, no request-time dependency
 * ============================================================
 */
export const permissionsPolicy = [
  'camera=()',
  'microphone=()',
  'geolocation=()',
  'payment=()',
  'usb=()',
  'hid=()',
  'serial=()',
  'midi=()',
].join(', ');
