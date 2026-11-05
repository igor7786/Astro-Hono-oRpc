// @app/middleware/security.server
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

// Start in report-only mode and watch your report endpoint, then set this to false.
export const CSP_REPORT_ONLY = false;

export const cspEnabled = () => envServer.PRODUCTION === 'true';

export const createNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};

/**
 * Returns the reporting destination URL path string.
 */
export const getReportEndpoint = () => openApiBasePath + cspPath;

export const buildCsp = (nonce: string) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // 1. Appended 'report-sha256' keyword and pointed it to the 'default' reporting group layout
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'report-sha256'; report-to default`,
    "style-src 'self' 'unsafe-inline'",
    `report-uri ${getReportEndpoint()}`, // Legacy fallback directive matching your route path
  ].join('; ');

// Same values as your Astro `permissionsPolicy`. It is repeated here on purpose:
// importing `@/lib/csp/headers` would also run the hashes database query in `hashes.ts`.
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
