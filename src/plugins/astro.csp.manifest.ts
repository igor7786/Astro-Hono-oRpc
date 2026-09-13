// astro-csp-manifest.ts
import type { AstroIntegration } from 'astro';
import { inArray } from 'drizzle-orm';

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

import { hashes } from '@/lib/drizzle/neon/schemas';

function getHtmlFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (extname(filePath) === '.html') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export default function cspManifestPlugin(): AstroIntegration {
  return {
    name: 'astro-csp-manifest',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const { neonDb } = await import('@/lib/drizzle/neon/client.neon.db');

        const distPath = dir.pathname;
        const htmlFiles = getHtmlFiles(distPath);

        const scriptHashes = new Set<string>();
        const styleHashes = new Set<string>();

        // Require src/href as an actual attribute (preceded by whitespace or
        // a quote, followed by =) so `data-src-map`, `data-hydrate-src`, etc.
        // on an otherwise-inline <script> don't get misread as "external"
        // and silently skipped.
        const scriptRegex = /<script(?![^>]*[\s"']src=)[^>]*>([\s\S]*?)<\/script>/gi;
        // Note: <style> tags never carry an href attribute (that's <link>),
        // so no exclusion lookahead is needed here.
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

        for (const file of htmlFiles) {
          const htmlContent = readFileSync(file, 'utf-8');
          let match;

          while ((match = scriptRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1];
            // CSP hashes cover the exact text between tags — never trim what gets hashed
            if (!rawContent || rawContent.trim() === '') continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            scriptHashes.add(`sha256-${hash}`);
          }

          while ((match = styleRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1];
            if (!rawContent || rawContent.trim() === '') continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            styleHashes.add(`sha256-${hash}`);
          }
        }

        const now = new Date();
        const rows = [
          ...Array.from(scriptHashes).map((hash) => ({
            id: `script:${hash}`,
            hash,
            format: 'script' as const,
            createdAt: now,
            updatedAt: now,
          })),
          ...Array.from(styleHashes).map((hash) => ({
            id: `style:${hash}`,
            hash,
            format: 'style' as const,
            createdAt: now,
            updatedAt: now,
          })),
        ];

        // Clear-and-reinsert per format so removed scripts/styles don't
        // linger as stale permitted hashes forever.
        await neonDb.delete(hashes).where(inArray(hashes.format, ['script', 'style']));

        if (rows.length > 0) {
          await neonDb.insert(hashes).values(rows);
        }

        console.log(
          `\x1b[32m[CSP Manifest]\x1b[0m Generated: ${scriptHashes.size} script hashes & ${styleHashes.size} style hashes.`
        );
      },
    },
  };
}
