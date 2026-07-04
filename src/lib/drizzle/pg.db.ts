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

export const db = drizzle(pgPool);
export { pgPool };

pgPool.on('connect', () => console.log('✅ Connected to PostgreSQL!'));
pgPool.on('error', (err) => console.error('❌ Postgres error:', err.message));

try {
  const ping = await pgPool.query('SELECT 1');
  console.log('PING:', ping.rows);

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS og_test (key TEXT PRIMARY KEY, value TEXT)
  `);
  await pgPool.query(
    'INSERT INTO og_test (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    ['og:test', 'hello world']
  );
  console.log('INSERT og_test ✅');

  const result = await pgPool.query('SELECT value FROM og_test WHERE key = $1', ['og:test']);
  console.log('SELECT og_test:', result.rows[0]?.value);
  await pgPool.end();
} catch (err: any) {
  console.error('❌ Postgres error ❌:', err?.message);
}

pgPool.on('connect', () => console.log('✅ Connected to PostgreSQL!'));
pgPool.on('error', (err) => console.error('❌ Postgres error:', err.message));

export default db;
