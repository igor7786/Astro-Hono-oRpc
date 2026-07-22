// src/lib/drizzle/sqlite/client.ts
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

import { resolve } from 'node:path';

import { envServer } from '@/lib/env/server.env';

function getSqlitePath() {
  if (envServer.PRODUCTION === 'true') {
    const sqlitePath = resolve(envServer.LOCAL_SQLITE_PATH);
    return sqlitePath;
  }
  const sqlitePath = resolve(envServer.VPS_SQLITE_PATH);
  return sqlitePath;
}

const sqlitePath = getSqlitePath();
const sqlite = new Database(sqlitePath, { create: true });

sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA synchronous = NORMAL;');
sqlite.run('PRAGMA cache_size = -64000;');
sqlite.run('PRAGMA mmap_size = 268435456;');
sqlite.run('PRAGMA busy_timeout = 5000;');
sqlite.run('PRAGMA foreign_keys = ON;');

const sqliteDb = drizzle({ client: sqlite });

export { sqliteDb };
export const closeSqlite = async () => sqlite.close();
