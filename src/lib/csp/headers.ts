import { scriptHashes, styleHashes } from '@/lib/csp/hashes';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

export const csp = [
  "default-src 'self'",
  "connect-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  `script-src 'self' ${scriptHashes}`,
  `style-src ${styleHashes}`,
  `report-uri '${openApiBasePath + cspPath}'`,
].join('; ');

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
