import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

import { resolve } from 'node:path';

const sqlitePath = resolve(process.cwd(), './src/lib/drizzle/sqlite/sqlite.db');
const sqlite = new Database(sqlitePath);
sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA synchronous = NORMAL;');
sqlite.run('PRAGMA cache_size = -64000;');
sqlite.run('PRAGMA mmap_size = 268435456;');
sqlite.run('PRAGMA busy_timeout = 5000;');
sqlite.run('PRAGMA foreign_keys = ON;');
const sqliteDb = drizzle({
  client: sqlite,
});

export { sqliteDb };
export const closeSqlite = async () => sqlite.close();
