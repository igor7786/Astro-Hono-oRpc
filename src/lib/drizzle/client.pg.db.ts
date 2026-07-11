import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { envServer } from '@/lib/env/server.env';

let pgPool: Pool;

if (envServer.PRODUCTION === 'false') {
  console.log('⚠️ Running in development mode, connecting to remote VPS Postgres with mTLS...');
  pgPool = new Pool({
    host: envServer.VPS_PG_HOST,
    port: envServer.VPS_PG_PORT,
    user: envServer.VPS_PG_USER,
    password: envServer.VPS_PG_PASS,
    database: envServer.VPS_PG_DB,
    ssl: {
      servername: envServer.VPS_TLS_SERVER,
      ca: await Bun.file(envServer.VPS_CA_CERT).text(),
      cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
      key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
      rejectUnauthorized: true,
    },
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
