// src/plugins/scalar.api.csp.ts
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';

const require = createRequire(import.meta.url);

function findScalarStandalone(): string {
  // 1. Try package export alias first if available
  try {
    return require.resolve('@scalar/api-reference/standalone');
  } catch {
    // Fall back to resolving from the package directory
  }

  const pkgDir = dirname(require.resolve('@scalar/api-reference/package.json'));
  const candidates = [
    join(pkgDir, 'dist/browser/standalone.js'),
    join(pkgDir, 'dist/browser/standalone.min.js'),
    join(pkgDir, 'dist/standalone.js'),
  ];

  const found = candidates.find((file) => existsSync(file));
  if (!found) {
    throw new Error(`[copy-scalar] Could not locate standalone bundle inside ${pkgDir}`);
  }
  return found;
}

export default function copyScalarIntegration(): AstroIntegration {
  const copyTo = (destPath: string) => {
    const src = findScalarStandalone();
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(src, destPath);
  };

  return {
    name: 'copy-scalar-standalone',
    hooks: {
      'astro:config:setup': ({ command }) => {
        if (command === 'dev') {
          copyTo(resolve('public/vendor/scalar-api-reference.js'));
        }
      },
      'astro:build:done': ({ dir }) => {
        const clientDir = fileURLToPath(dir);
        copyTo(resolve(clientDir, 'vendor/scalar-api-reference.js'));
      },
    },
  };
}
