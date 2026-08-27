// src/lib/csp.ts
import { eq } from 'drizzle-orm';

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

import { hashes } from '@/lib/drizzle/neon/schemas';
import { themeScriptPath } from '@/lib/helpers/paths';

/**
 * ============================================================
 * CSP — computed once at module load (server startup for SSR,
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

try {
  const { neonDb } = await import('@/lib/drizzle/neon/client.neon.db');
  const rows = await neonDb
    .select({ hash: hashes.hash })
    .from(hashes)
    .where(eq(hashes.format, 'script'));

  crawledScripts = rows.map((row) => `'${row.hash}'`);
} catch (e) {
  console.warn(
    '[CSP] Could not read script hashes from DB yet (this is normal during early build steps).',
    e
  );
}

// Merge the static theme script hash along with extracted build arrays
export const scriptHashes = [
  themeScriptHash ? `'${themeScriptHash}'` : '',
  ...crawledScripts, // Guaranteed to be an array now
]
  .filter(Boolean)
  .join(' ');

// Merge inline production layout style hashes
export const styleHashes = "'self' 'unsafe-inline'";
