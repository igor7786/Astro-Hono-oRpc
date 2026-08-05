import { eq } from 'drizzle-orm';

import { test } from '@/lib/drizzle/pg/pg.schema';
import { base } from '@/server/procedures/base';

export const ClientsRoute = base.tests.testClients.handler(async ({ context, errors }) => {
  let kafkaClient = 'Client Kafka failed to connect ❌';
  let pgClient = 'Client Postgres failed to connect ❌';
  let sqliteClient = 'Client SQLite failed to connect ❌';
  let redisClient = 'Client Redis failed to connect ❌';
  let s3Client = 'Client S3 failed to connect ❌';

  return { status: 'ok' };
});
