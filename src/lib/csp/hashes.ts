import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

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

// Inline <style> tags the crawler doesn't see. Copy the hash from the browser console:
//   "Consider using a hash ('sha256-...')"
// Astro-owned tags keep their hash until Astro is upgraded; re-check after upgrades.
const EXTRA_STYLE_HASHES = [
  'sha256-StEaX+se6YS7pqjzrzMIA0KaX9zF/8zAhvQXZAe5epY=',
  'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', // Empty <style> tag injected dynamically at runtime
];

// Inline scripts the crawler doesn't see, same idea.
const EXTRA_SCRIPT_HASHES: string[] = [];

const quote = (hash: string) => `'${hash}'`;

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

// Initialize first, so both arrays are iterable regardless of DB state
let crawledScripts: string[] = [];
let crawledStyles: string[] = [];

try {
  const { neonDb } = await import('@/lib/drizzle/neon/client.neon.db');

  const scriptRows = await neonDb
    .select({ hash: hashes.hash })
    .from(hashes)
    .where(eq(hashes.format, 'script'));
  crawledScripts = scriptRows.map((row) => quote(row.hash));

  // Inline <style> tags. Needs the crawler to store them with format 'style'.
  const styleRows = await neonDb
    .select({ hash: hashes.hash })
    .from(hashes)
    .where(eq(hashes.format, 'style'));
  crawledStyles = styleRows.map((row) => quote(row.hash));
} catch (e) {
  console.warn('[CSP] Could not read hashes from DB yet (this is normal during early build steps).', e);
}

// Set removes duplicates. The theme script is also in the DB, which caused a repeated entry.
const toDirective = (list: (string | null)[]) => [...new Set(list.filter(Boolean))].join(' ');

export const scriptHashes = toDirective([
  themeScriptHash ? quote(themeScriptHash) : null,
  ...crawledScripts,
  ...EXTRA_SCRIPT_HASHES.map(quote),
]);

// Hashes only. The policy adds 'self' itself, and there is no 'unsafe-inline' anywhere.
export const styleHashes = toDirective([...crawledStyles, ...EXTRA_STYLE_HASHES.map(quote)]);
