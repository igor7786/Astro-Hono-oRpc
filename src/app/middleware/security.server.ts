// @app/middleware/security.server
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

// Start in report-only mode and watch your report endpoint, then set this to false.
export const cspEnabled = envServer.PRODUCTION === 'true';

export const createNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};

/**
 * Returns the reporting destination URL path string.
 */
export const getReportEndpoint = () => openApiBasePath + cspPath;

// @app/middleware/security.server

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
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'report-sha256'; report-to default`,
    // 👇 REMOVE 'unsafe-inline' AND ADD THE STYLE NONCE HERE
    `style-src 'self' 'nonce-${nonce}'`,
    `report-uri ${getReportEndpoint()}`,
  ].join('; ');
