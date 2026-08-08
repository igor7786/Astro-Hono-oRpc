import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';

import { test } from '@/lib/drizzle/pg/pg.schema';
import { test as sqliteTest } from '@/lib/drizzle/sqlite/schema';
import { base } from '@/server/procedures/base';
import type { TestClientSchema } from '@/server/schemas/clients.schema';

async function checkClients(context: any): Promise<TestClientSchema> {
  let kafkaClient = 'Client Kafka failed to connect ❌';
  let pgClient = 'Client Postgres failed to connect ❌';
  let sqliteClient = 'Client SQLite failed to connect ❌';
  let redisClient = 'Client Redis failed to connect ❌';
  let s3Client = 'Client S3 failed to connect ❌';

  try {
    const [reqPg] = (await context.pg?.select().from(test).where(eq(test.key, 'Ping')).limit(1)) ?? [];
    pgClient = reqPg ? 'Client Postgres connected ✅' : pgClient;
  } catch {}

  try {
    const [reqSqlite] =
      (await context.sqlite?.select().from(sqliteTest).where(eq(sqliteTest.key, 'ping')).limit(1)) ?? [];
    sqliteClient = reqSqlite ? 'Client SQLite connected ✅' : sqliteClient;
  } catch {}

  try {
    const redisPing = await context.redis?.ping();
    redisClient = redisPing === 'PONG' ? 'Client Redis connected ✅' : redisClient;
  } catch {}

  try {
    const s3Ping = await context.rustfs?.send(new HeadBucketCommand({ Bucket: 'og-images' }));
    s3Client = s3Ping ? 'Client S3 connected ✅' : s3Client;
  } catch {}

  try {
    const reqKafka = await context.producer?.metadata({ topics: ['health'] });
    kafkaClient = reqKafka ? 'Client Kafka connected ✅' : kafkaClient;
  } catch {}

  return {
    sqliteStatus: sqliteClient,
    pgStatus: pgClient,
    kafkaStatus: kafkaClient,
    redisStatus: redisClient,
    s3Status: s3Client,
  };
}

export const ClientsRoute = base.tests.testClients.handler(async function* ({ context, signal }) {
  while (!signal?.aborted) {
    yield await checkClients(context);
    await new Promise((r) => setTimeout(r, 3000));
  }
});
