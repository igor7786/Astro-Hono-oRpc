// @app/middleware/security.server.ts
import { envServer } from '@/lib/env/server.env';
import { cspPath } from '@/lib/helpers/api.paths';

export const cspEnabled = envServer.PRODUCTION === 'true';

export const createNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};

export const getReportEndpoint = () => envServer.PUBLIC_OPEN_API_BASE_PATH + cspPath;

const REPORT_GROUP = 'default';

export const reportingEndpointsHeader = (): string | null => {
  try {
    return `${REPORT_GROUP}="${new URL(envServer.PUBLIC_URL).origin}${getReportEndpoint()}"`;
  } catch {
    return null;
  }
};

export const isScalarRoute = (pathname: string) => pathname.replace(/\/+$/, '') === '/scalar';

export const buildApiCsp = () =>
  `default-src 'none'; frame-ancestors 'none'; sandbox; report-uri ${getReportEndpoint()}; report-to ${REPORT_GROUP}`;

export const buildCsp = (nonce: string, { scalar = false }: { scalar?: boolean } = {}) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    scalar ? "img-src 'self' data: blob:" : "img-src 'self' data:",
    scalar ? "font-src 'self' data: https://scalar.com" : "font-src 'self' data:",
    scalar && 'frame-src blob:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    scalar ? "base-uri 'self'" : "base-uri 'none'",
    "form-action 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'report-sample' 'report-sha256'`,
    `style-src-elem 'self' 'nonce-${nonce}' 'report-sample'`,
    "style-src-attr 'unsafe-inline'",
    `report-uri ${getReportEndpoint()}`,
    `report-to ${REPORT_GROUP}`,
  ]
    .filter(Boolean)
    .join('; ');
