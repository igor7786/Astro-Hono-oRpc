import { scriptHashes, styleHashes } from '@/lib/csp/hashes';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

const buildBaseDirectives = (scriptSrc: string, styleDirectives: string[]) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    scriptSrc,
    ...styleDirectives,
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to default',
  ].join('; ');

/**
 * Static / prerendered routes (/playground/blog/*) — uses build-time SHA-256 hashes
 */
export const cspStatic = buildBaseDirectives(`script-src 'self' ${scriptHashes} 'report-sample'`, [
  `style-src 'self' ${styleHashes} 'report-sample'`,
  "style-src-attr 'unsafe-inline'", // style="..." attributes; <style> tags stay hashed
]);

/**
 * Dynamic SSR routes (/playground/* excluding /playground/blog/*) — uses per-request nonces
 */
export const buildDynamicCsp = (nonce: string) =>
  buildBaseDirectives(`script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'report-sample'`, [
    `style-src 'self' 'nonce-${nonce}' 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
  ]);

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
