// src/lib/csp/headers.ts
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
  "style-src-attr 'unsafe-inline'",
]);

/**
 * Dynamic SSR routes (/playground/* excluding /playground/blog/*)
 * Combines crawled hashes (for Astro's built-in head tags) + per-request nonce (for dynamic SSR tags)
 */
export const buildDynamicCsp = (nonce: string) =>
  buildBaseDirectives(`script-src 'self' 'nonce-${nonce}' ${scriptHashes} 'report-sample'`, [
    `style-src 'self' 'nonce-${nonce}' ${styleHashes} 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
  ]);

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
