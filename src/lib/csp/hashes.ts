import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

// src/lib/csp/hashes.ts
import { eq } from 'drizzle-orm';

import { hashes } from '@/lib/drizzle/neon/schemas';
import { themeScriptPath } from '@/lib/helpers/paths';

/**
 * ============================================================
 * CSP hashes — computed once at module load (server startup for SSR,
 * or at each `astro build` pass for prerendered routes — see
 * Dockerfile's two-pass build for why prerendered pages need
 * the hashes table already populated before this runs)
 * ============================================================
 */
const themeScriptHash = (() => {
  try {
    if (existsSync(themeScriptPath)) {
      const content = readFileSync(themeScriptPath, 'utf-8');
      return `sha256-${createHash('sha256').update(content).digest('base64')}`;
    }
  } catch (e) {
    console.error('[CSP] Failed to hash theme-checker.js — script-src will block it', e);
  }
  return null;
})();

// Safely initialize arrays to guarantee they are iterable regardless of DB state
let crawledScripts: string[] = [];
let crawledStyles: string[] = [];

try {
  const { neonDb } = await import('@/lib/drizzle/neon/client.neon.db');

  const scriptRows = await neonDb
    .select({ hash: hashes.hash })
    .from(hashes)
    .where(eq(hashes.format, 'script'));
  crawledScripts = scriptRows.map((row) => `'${row.hash}'`);

  // Inline <style> tags. Needs your crawler to store them with format 'style'.
  const styleRows = await neonDb
    .select({ hash: hashes.hash })
    .from(hashes)
    .where(eq(hashes.format, 'style'));
  crawledStyles = styleRows.map((row) => `'${row.hash}'`);
} catch (e) {
  console.warn('[CSP] Could not read hashes from DB yet (this is normal during early build steps).', e);
}

export const scriptHashes = [themeScriptHash ? `'${themeScriptHash}'` : '', ...crawledScripts]
  .filter(Boolean)
  .join(' ');

// Hashes only. The policy adds 'self' itself, and there is no 'unsafe-inline' anywhere.
export const styleHashes = crawledStyles.join(' ');
