// astro-csp-manifest.ts
import type { AstroIntegration } from 'astro';
import { eq } from 'drizzle-orm';

import console from 'node:console';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

import { test } from '@/lib/drizzle/sqlite/schema';

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
        const { sqliteDb, closeSqlite } = await import('@/lib/drizzle/sqlite/client.ts');
        console.log(
          '[server] SQLITE DRIZZLE ->',
          await sqliteDb.select().from(test).where(eq(test.key, 'ping'))
        );
        // Resolve target build directory
        const distPath = dir.pathname;
        const htmlFiles = getHtmlFiles(distPath);

        const scriptHashes = new Set<string>();
        const styleHashes = new Set<string>();

        // Regex selectors that skip external asset calls (ignores tags containing src="..." or href="...")
        const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
        const styleRegex = /<style(?![^>]*\bhref\b)[^>]*>([\s\S]*?)<\/style>/gi;

        for (const file of htmlFiles) {
          const htmlContent = readFileSync(file, 'utf-8');
          let match;

          // Process scripts
          while ((match = scriptRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1]?.trim();
            if (!rawContent) continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            scriptHashes.add(`'sha256-${hash}'`);
          }

          // Process style blocks
          while ((match = styleRegex.exec(htmlContent)) !== null) {
            const rawContent = match[1]?.trim();
            if (!rawContent) continue;
            const hash = createHash('sha256').update(rawContent, 'utf-8').digest('base64');
            styleHashes.add(`'sha256-${hash}'`);
          }
        }

        // Output structural JSON manifest
        const manifestOutputPath = join(process.cwd(), 'src/plugins', 'csp-manifest.json');
        const manifestPayload = {
          scripts: Array.from(scriptHashes),
          styles: Array.from(styleHashes),
        };

        writeFileSync(manifestOutputPath, JSON.stringify(manifestPayload, null, 2), 'utf-8');
        console.log(
          `\x1b[32m[CSP Manifest]\x1b[0m Generated: ${manifestPayload.scripts.length} script hashes & ${manifestPayload.styles.length} style hashes.`
        );
      },
    },
  };
}
