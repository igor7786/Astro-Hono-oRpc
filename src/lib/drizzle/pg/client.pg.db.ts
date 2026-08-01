// src/lib/drizzle/pg/client.pg.db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { envServer } from '@/lib/env/server.env';

const { Pool } = pg;

async function createDb() {
  if (envServer.PRODUCTION === 'false') {
    console.log('⚠️ [POSTGRESQL -> DRIZZLE] Dev mode — connecting via pgbouncer mTLS...');
    const { tls } = await import('@/lib/tls/client.tls');
    const ssl = await tls();

    const pool = new Pool({
      host: envServer.VPS_PGB_HOST,
      port: envServer.VPS_PGB_PORT,
      user: envServer.VPS_PGB_USER,
      password: envServer.VPS_PGB_PASS,
      database: envServer.VPS_PGB_DB,
      max: 60,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl,
    });

    return drizzle({ client: pool });
  }

  console.log('✅ [POSTGRESQL -> DRIZZLE] Prod mode — connecting via pgbouncer (internal)...');
  const pool = new Pool({
    host: envServer.PROD_PGB_HOST,
    port: envServer.PROD_PGB_PORT,
    user: envServer.VPS_PGB_USER,
    password: envServer.VPS_PGB_PASS,
    database: envServer.VPS_PGB_DB,
    max: 60,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // no ssl — internal Docker network
  });

  return drizzle({ client: pool });
}

const pgDb = await createDb();
export { pgDb };
