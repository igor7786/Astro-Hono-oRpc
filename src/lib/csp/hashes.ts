// src/lib/csp.ts
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

import { manifestPath, themeScriptPath } from '@/lib/helpers/paths';

/**
 * ============================================================
 * CSP — computed once at module load (server startup for SSR,
 * or at each `astro build` pass for prerendered routes — see
 * Dockerfile's two-pass build for why prerendered pages need
 * csp-manifest.json to already exist on disk before this runs)
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

// Safely initialize arrays to guarantee they are iterable during compilation
let crawledScripts: string[] = [];
try {
  if (existsSync(manifestPath)) {
    const content = readFileSync(manifestPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Ensure the arrays exist explicitly inside the parsed file
    if (Array.isArray(parsed?.scripts)) crawledScripts = parsed.scripts;
  }
} catch (e) {
  console.warn(
    '[CSP] Manifest file not found or unreadable yet (this is normal during early build steps).'
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
