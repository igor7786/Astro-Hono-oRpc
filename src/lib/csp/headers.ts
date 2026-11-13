import { scriptHashes, styleHashes } from '@/lib/csp/hashes';
import { cspPath, openApiBasePath } from '@/lib/helpers/paths';

// false: enforce the legacy policy and only REPORT the strict one.
// true:  enforce the strict policy (no 'unsafe-inline'). Flip it once the console is clean.
// export const STRICT_STYLES = true;

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
  ].join('; ');

export const cspStrict = buildCsp([
  `style-src 'self' ${styleHashes} 'report-sample'`,
  "style-src-attr 'unsafe-inline'", // style="..." attributes (bones); <style> tags stay hashed
]);

// export const cspReportOnly = STRICT_STYLES ? null : cspStrict;

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
