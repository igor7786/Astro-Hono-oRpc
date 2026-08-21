// astro-csp-manifest.ts
import type { AstroIntegration } from 'astro';
import { eq } from 'drizzle-orm';

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

        const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
        const styleRegex = /<style(?![^>]*\bhref\b)[^>]*>([\s\S]*?)<\/style>/gi;

        for (const file of htmlFiles) {
          const htmlContent = readFileSync(file, 'utf-8');
          let match;

          while ((match = scriptRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1]?.trim();
            if (!rawContent) continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            scriptHashes.add(`sha256-${hash}`);
          }

          while ((match = styleRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1]?.trim();
            if (!rawContent) continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            scriptHashes.add(`sha256-${hash}`);
          }
        }

        // Clear-and-reinsert per format so removed scripts/styles don't
        // linger as stale permitted hashes forever
        await neonDb.delete(hashes).where(eq(hashes.format, 'script'));
        await neonDb.delete(hashes).where(eq(hashes.format, 'style'));

        const now = new Date();
        const rows = [
          ...Array.from(scriptHashes).map((hash) => ({
            id: hash,
            hash,
            format: 'script' as const,
            createdAt: now,
            updatedAt: now,
          })),
          ...Array.from(styleHashes).map((hash) => ({
            id: hash,
            hash,
            format: 'style' as const,
            createdAt: now,
            updatedAt: now,
          })),
        ];

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
