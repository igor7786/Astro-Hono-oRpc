// @app/middleware/security.server
import { envServer } from '@/lib/env/server.env';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

export const cspEnabled = envServer.PRODUCTION === 'true';

export const createNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};

/** Returns the reporting destination URL path string. */
export const getReportEndpoint = () => openApiBasePath + cspPath;

// One group name, used in the Reporting-Endpoints header and in the policy's report-to
export const REPORT_GROUP = 'csp-endpoint';

/** Value for the Reporting-Endpoints header, or null if PUBLIC_URL is missing or invalid. */
export const reportingEndpointsHeader = (): string | null => {
  try {
    return `${REPORT_GROUP}="${new URL(envServer.PUBLIC_URL).origin}${getReportEndpoint()}"`;
  } catch {
    return null;
  }
};

// Inline <style> tags that Scalar's React build creates without a nonce.
// After a Scalar upgrade, copy any new hashes from the browser console.
const SCALAR_STYLE_HASHES = [
  "'sha256-l/2OpPg0d+2VLTLgwjf5mQo2CYwHDEqdj5TjbfEyVJI='",
  "'sha256-jhbr7vpdj7m5aUVk1M7gLF5cS0emmbwQS2neQtOW+L8='",
];

// The Scalar reference page, served under the /app base path
export const isScalarRoute = (pathname: string) => pathname.replace(/\/+$/, '') === '/app/scala';

export const buildCsp = (nonce: string, { scalar = false }: { scalar?: boolean } = {}) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    scalar ? "img-src 'self' data: blob:" : "img-src 'self' data:",
    "font-src 'self' data:",
    scalar && 'frame-src blob:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'report-sample' 'report-sha256'`,
    `style-src-elem ${[
      "'self'",
      `'nonce-${nonce}'`,
      ...(scalar ? SCALAR_STYLE_HASHES : []),
      "'report-sample'",
    ].join(' ')}`,
    "style-src-attr 'unsafe-inline'",
    `report-uri ${getReportEndpoint()}`,
    `report-to ${REPORT_GROUP}`,
  ]
    .filter(Boolean)
    .join('; ');
