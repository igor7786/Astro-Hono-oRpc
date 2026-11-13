import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

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

// Inline scripts/styles the crawler doesn't see. Copy the hash from the browser console:
//   "Consider using a hash ('sha256-...')"
const EXTRA_SCRIPT_HASHES: string[] = [];
const EXTRA_STYLE_HASHES: string[] = [
  'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
  'sha256-StEaX+se6YS7pqjzrzMIA0KaX9zF/8zAhvQXZAe5epY=',
];

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

let crawledScripts: string[] = [];
let crawledStyles: string[] = [];

try {
  const { neonDb } = await import('@/lib/drizzle/neon/client.neon.db');

  const rows = await neonDb.select({ format: hashes.format, hash: hashes.hash }).from(hashes);

  for (const row of rows) {
    if (row.format === 'script') {
      crawledScripts.push(quote(row.hash));
    } else if (row.format === 'style') {
      crawledStyles.push(quote(row.hash));
    }
  }
} catch (e) {
  console.warn('[CSP] Could not read hashes from DB yet (this is normal during early build steps).', e);
}

const toDirective = (list: (string | null)[]) => [...new Set(list.filter(Boolean))].join(' ');

export const scriptHashes = toDirective([
  themeScriptHash ? quote(themeScriptHash) : null,
  ...crawledScripts,
  ...EXTRA_SCRIPT_HASHES.map(quote),
]);

export const styleHashes = toDirective([...crawledStyles, ...EXTRA_STYLE_HASHES.map(quote)]);
