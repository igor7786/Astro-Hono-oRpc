// src/middleware.ts
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defineMiddleware } from 'astro:middleware';

/**
 * ============================================================
 * CSP — computed once at server startup, not per-request
 * ============================================================
 */
const themeScriptHash = (() => {
  try {
    const themeScriptPath = join(process.cwd(), 'src/lib/helpers/theme-checker.js');
    if (existsSync(themeScriptPath)) {
      const content = readFileSync(themeScriptPath, 'utf-8');
      return `sha256-${createHash('sha256').update(content).digest('base64')}`;
    }
  } catch (e) {
    console.error('[CSP] Failed to hash theme-checker.js — script-src will block it', e);
  }
  return null;
})();

// Safely initialize arrays to guarantee they are iterable during compilation
let crawledScripts: string[] = [];
let crawledStyles: string[] = [];

try {
  const manifestPath = join(process.cwd(), 'src/plugins/csp-manifest.json');
  if (existsSync(manifestPath)) {
    const content = readFileSync(manifestPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Ensure the arrays exist explicitly inside the parsed file
    if (Array.isArray(parsed?.scripts)) crawledScripts = parsed.scripts;
    if (Array.isArray(parsed?.styles)) crawledStyles = parsed.styles;
  }
} catch (e) {
  console.warn(
    '[CSP] Manifest file not found or unreadable yet (this is normal during early build steps).'
  );
}

// Merge the static theme script hash along with extracted build arrays
const scriptHashes = [
  themeScriptHash ? `'${themeScriptHash}'` : '',
  ...crawledScripts, // Guaranteed to be an array now
]
  .filter(Boolean)
  .join(' ');

// Merge inline production layout style hashes
const styleHashes = "'self' 'unsafe-inline'";

const CSP = [
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
  'report-uri /api/csp-report',
].join('; ');

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const response = await next();

  /**
   * ============================================================
   * SECURITY HEADERS — every response: HTML, API, static
   * ============================================================
   */
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'hid=()',
      'serial=()',
      'midi=()',
    ].join(', ')
  );

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  const isStaticOrApi =
    context.isPrerendered || pathname.startsWith('/_astro/') || pathname.startsWith('/api/');

  const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;

  /**
   * ============================================================
   * CACHE CONTROL — only dynamically-rendered HTML
   * ============================================================
   */
  if (!isStaticOrApi && isHtml) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    response.headers.set('Pragma', 'no-cache');
  }

  /**
   * ============================================================
   * CSP — Astro-rendered HTML only, never /api/* (Hono owns its
   * own CSP for /api/docs — see src/server/app.ts)
   * ============================================================
   */
  if (import.meta.env.PROD && CSP && !pathname.startsWith('/api/') && isHtml) {
    response.headers.set('Content-Security-Policy', CSP);
  }

  return response;
});
