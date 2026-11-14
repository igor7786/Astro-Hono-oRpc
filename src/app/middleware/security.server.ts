// @app/middleware/security.server
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

export const cspEnabled = envServer.PRODUCTION === 'true';

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
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'report-sample' 'report-sha256'`,
    `style-src-elem 'self' 'nonce-${nonce}' 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
    `report-uri ${getReportEndpoint()}`,
    'report-to default',
  ].join('; ');
