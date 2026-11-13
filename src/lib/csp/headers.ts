import { scriptHashes } from '@/lib/csp/hashes';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

const buildCsp = (styleDirectives: string[]) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `script-src 'self' ${scriptHashes} 'report-sample'`,
    ...styleDirectives,
    `report-uri ${openApiBasePath + cspPath}`,
    'report-to default',
  ].join('; ');

export const cspStrict = buildCsp(["style-src 'self' 'unsafe-inline'"]);

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
