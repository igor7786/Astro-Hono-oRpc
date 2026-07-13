import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { envServer } from '@/lib/env/server.env';
import { tls } from '@/lib/tls/client.tls';

let pgPool: Pool;

if (envServer.PRODUCTION === 'false') {
  console.log('⚠️ Running in development mode, connecting to remote VPS Postgres with mTLS...');
  pgPool = new Pool({
    host: envServer.VPS_PG_HOST,
    port: envServer.VPS_PG_PORT,
    user: envServer.VPS_PG_USER,
    password: envServer.VPS_PG_PASS,
    database: envServer.VPS_PG_DB,
    ssl: await tls(), // Use the TLS configuration for secure connection
  });
} else {
  console.log('⚠️ Running in production mode, connecting to local Postgres without TLS...');
  pgPool = new Pool({
    host: envServer.VPS_PG_HOST,
    port: envServer.VPS_PG_PORT,
    user: envServer.VPS_PG_USER,
    password: envServer.VPS_PG_PASS,
    database: envServer.VPS_PG_DB,
  });
}

pgPool.on('connect', () => console.log('✅ Connected to PostgreSQL!'));
pgPool.on('error', (err) => console.error('❌ Postgres error:', err.message));

export const db = drizzle(pgPool);
export { pgPool };
export default db;
