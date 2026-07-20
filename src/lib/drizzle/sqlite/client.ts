import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

import { resolve } from 'node:path';

const sqlitePath = resolve(process.cwd(), './src/lib/drizzle/sqlite/sqlite.db');
const sqlite = new Database(sqlitePath);
sqlite.run('PRAGMA journal_mode = WAL;');
const sqliteDb = drizzle({
  client: sqlite,
});

export { sqliteDb };
export const closeSqlite = async () => sqlite.close();
