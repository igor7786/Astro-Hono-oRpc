// src/lib/drizzle/client.pg.db.ts
import { drizzle } from 'drizzle-orm/bun-sql';

import { SQL } from 'bun';

import { envServer } from '@/lib/env/server.env';

async function createDb() {
  if (envServer.PRODUCTION === 'false') {
    console.log('⚠️ [POSTGRESQL -> DRIZZLE] Dev mode — connecting to remote VPS PostgreSQL with TLS...');
    const { tls } = await import('@/lib/tls/client.tls');
    const { ca, cert, key, rejectUnauthorized } = await tls();
    const client = new SQL({
      hostname: envServer.VPS_PG_HOST,
      port: envServer.VPS_PG_PORT,
      username: envServer.VPS_PG_USER,
      password: envServer.VPS_PG_PASS,
      database: envServer.VPS_PG_DB,
      tls: { ca, cert, key, rejectUnauthorized },
      max: 10,
      idleTimeout: 30, // don't wait forever for a connection
      connectionTimeout: 10, // fail fast if VPS unreachable
      maxLifetime: 3600, // recycle connections every hour
      prepare: true,
    });

    return drizzle({ client });
  }

  console.log('✅ [POSTGRESQL -> DRIZZLE] Prod mode — connecting to local PostgreSQL without TLS...');
  const client = new SQL({
    hostname: envServer.LOCAL_PG_HOST,
    port: envServer.VPS_PG_PORT,
    username: envServer.VPS_PG_USER,
    password: envServer.VPS_PG_PASS,
    database: envServer.VPS_PG_DB,
    max: 10,
    idleTimeout: 30, // don't wait forever for a connection
    connectionTimeout: 10, // fail fast if VPS unreachable
    maxLifetime: 3600, // recycle connections every hour
    prepare: true,
  });

  return drizzle({ client });
}

const db = await createDb();
export { db };
