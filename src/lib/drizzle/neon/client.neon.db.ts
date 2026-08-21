// src/lib/drizzle/pg/client.pg.db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { envServer } from '@/lib/env/server.env';

const { Pool } = pg;

async function createDb() {
  const pool = new Pool({
    connectionString: envServer.NEON_DB_URL,
  });

  return drizzle({ client: pool });
}

const neonDb = await createDb();
export { neonDb };
