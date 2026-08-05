import { eq } from 'drizzle-orm';

import { test } from '@/lib/drizzle/pg/pg.schema';
import { test as sqliteTest } from '@/lib/drizzle/sqlite/schema';
import { base } from '@/server/procedures/base';

export const ClientsRoute = base.tests.testClients.handler(async ({ context, errors }) => {
  let kafkaClient = 'Client Kafka failed to connect ❌';
  let pgClient = 'Client Postgres failed to connect ❌';
  let sqliteClient = 'Client SQLite failed to connect ❌';
  let redisClient = 'Client Redis failed to connect ❌';
  let s3Client = 'Client S3 failed to connect ❌';
  // Check Postgres connection
  try {
    const [reqPg] = (await context.pg?.select().from(test).where(eq(test.key, 'Ping')).limit(1)) ?? [];

    pgClient = reqPg ? 'Client Postgres connected ✅' : 'Client Postgres failed to connect ❌';
  } catch (error) {
    pgClient = `Client Postgres failed to connect ❌`;
  }
  // Check SQLite connection
  try {
    const [reqSqlite] =
      (await context.sqlite?.select().from(sqliteTest).where(eq(sqliteTest.key, 'ping')).limit(1)) ?? [];

    sqliteClient = reqSqlite ? 'Client SQLite connected ✅' : 'Client SQLite failed to connect ❌';
  } catch (error) {
    sqliteClient = `Client SQLite failed to connect ❌`;
  }
  // Check Redis connection
  try {
    const redisPing = await context.redis?.ping();
    redisClient =
      redisPing === 'PONG' ? 'Client Redis connected ✅' : 'Client Redis failed to connect ❌';
  } catch (error) {
    redisClient = `Client Redis failed to connect ❌`;
  }
  return {
    sqliteStatus: sqliteClient,
    pgStatus: pgClient,
    kafkaStatus: kafkaClient,
    redisStatus: redisClient,
    s3Status: s3Client,
  };
});
