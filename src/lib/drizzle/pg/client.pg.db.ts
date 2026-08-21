// src/lib/drizzle/pg/client.pg.db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { envServer } from '@/lib/env/server.env';

const { Pool } = pg;

async function createDb() {
  envServer.PRODUCTION === 'false'
    ? console.log('⚠️ [POSTGRESQL -> DRIZZLE] Dev mode — connecting via pgbouncer mTLS...')
    : console.log('✅ [POSTGRESQL -> DRIZZLE] Prod mode — connecting via pgbouncer (internal)... mTLS');

  const pool = new Pool({
    host: envServer.PRODUCTION === 'false' ? envServer.VPS_PGB_HOST : envServer.PROD_PGB_HOST,
    port: envServer.PRODUCTION === 'false' ? envServer.VPS_PGB_PORT : envServer.PROD_PGB_PORT,
    user: envServer.VPS_PGB_USER,
    password: envServer.VPS_PGB_PASS,
    database: envServer.VPS_PGB_DB,
    max: 60,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl:
      envServer.PRODUCTION === 'false'
        ? await (await import('@/lib/tls/client.tls')).tls(true)
        : undefined,
  });

  // Without this, an idle client dying (pgbouncer/network dropping it)
  // emits 'error' on the pool with no listener -> uncaught -> process dies
  pool.on('error', (err) => {
    console.error('❌ [POSTGRESQL -> DRIZZLE] Idle client error:', err.message);
  });

  return drizzle({ client: pool });
}

const pgDb = await createDb();
export { pgDb };
