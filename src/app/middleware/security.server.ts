import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

// Start in report-only mode and watch your report endpoint, then set this to false.
export const CSP_REPORT_ONLY = true;

export const cspEnabled = () => envServer.PRODUCTION === 'true';

export const createNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};

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
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    `report-uri ${openApiBasePath + cspPath}`,
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
