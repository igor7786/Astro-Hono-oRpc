import { resolve } from 'node:path';

import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { ogImages } from '@/lib/drizzle/sqlite/schemas';
import type { NewOgImage } from '@/lib/drizzle/sqlite/schemas';
import { envServer } from '@/lib/env/server.env';

const manifestDir = envServer.SQLITE_MANIFEST_DIR;
const manifestPath = resolve(process.cwd(), manifestDir, 'manifest.json');
const file = Bun.file(manifestPath);

if (!(await file.exists())) {
  console.log('No fallback manifest found.');
  process.exit(0);
}

const manifest: Record<string, Omit<NewOgImage, 'id'>> = await file.json();

try {
  for (const [id, entry] of Object.entries(manifest)) {
    const row: NewOgImage = {
      id,
      ...entry,
    };

    await sqliteDb.insert(ogImages).values(row).onConflictDoUpdate({
      target: ogImages.id,
      set: row,
    });
  }
  if (process.env.MANIFEST_DIR && process.env.MANIFEST_DIR.length > 0) await file.delete();

  console.log(`Restored ${Object.keys(manifest).length} OG images.`);
} catch (err) {
  console.error('Failed to restore manifest:', err);
  process.exit(1);
}

process.exit(0);
