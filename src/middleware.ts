// src/middleware.ts
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defineMiddleware } from 'astro:middleware';

/**
 * ============================================================
 * CSP — computed once at server startup, not per-request
 * ============================================================
 *
 * This middleware is the single source of truth for CSP.
 * astro.config.mjs must NOT have a `security.csp` block —
 * Astro's native CSP auto-generates style hashes that silently
 * disable 'unsafe-inline' (a hash's presence nullifies
 * unsafe-inline per the CSP spec), which breaks any runtime
 * inline style (React `style={{}}` props, animation/drag libs,
 * etc). See: github.com/withastro/roadmap/discussions/1325
 */
const themeScriptHash = (() => {
  try {
    const themeScriptPath = join(process.cwd(), 'src/lib/helpers/theme-checker.js');
    const content = readFileSync(themeScriptPath, 'utf-8');
    return `sha256-${createHash('sha256').update(content).digest('base64')}`;
  } catch (e) {
    console.error('[CSP] Failed to hash theme-checker.js — script-src will block it', e);
    return null;
  }
})();

const missingHashes = [
  // "'sha256-zvOr/gdK3jsdZw9UL5+JdhIPfba74txoTxCQ6m3RLLI='",
  "'sha256-eIXWvAmxkr251LJZkjniEK5LcPF3NkapbJepohwYRIc='",
  "'sha256-Ya0pUYrC7nM5Cn/056TyVuEiz6dFGrzmkWzgON0pF0U='",
].join(' ');

const CSP = themeScriptHash
  ? [
      "default-src 'self'",
      "connect-src 'self'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      `script-src 'self' '${themeScriptHash}' ${missingHashes}`,
      "style-src 'self' 'unsafe-inline'",
      'report-uri /api/csp-report',
    ].join('; ')
  : null;

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
