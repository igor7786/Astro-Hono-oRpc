import { createMiddleware } from 'hono/factory';

import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { redisVps } from '@/lib/redis/client.redis.vps';
import { producer } from '@/lib/redpanda-kafka/producer';
import { rustfsClient } from '@/lib/s3/client.rustfs.vps';
import { npmplusGeoExtractor } from '@/server/hono-middleware/geo';

// Inject clients as Sqlite, Redis, PG and so on ...
const injectClients = createMiddleware(async (c, next) => {
  c.set('sqlite', sqliteDb);
  c.set('neon', neonDb);
  c.set('pg', pgDb);
  c.set('producer', producer);
  c.set('rustfs', rustfsClient);
  c.set('redis', redisVps);
  c.set('geo', npmplusGeoExtractor(c));
  await next();
});

export default injectClients;
