import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';

import { test } from '@/lib/drizzle/pg/pg.schema';
import { test as sqliteTest } from '@/lib/drizzle/sqlite/schema';
import { base } from '@/server/procedures/base';
import type { ClientStatus, TestClientSchema } from '@/server/schemas/tests-schema/clients.schema';

async function timed(name: string, fn: () => Promise<boolean>): Promise<ClientStatus> {
  const start = performance.now();
  try {
    const ok = await fn();
    return {
      name,
      connected: ok,
      message: ok ? `${name} connected` : `${name} failed to connect`,
      latencyMs: Math.round(performance.now() - start),
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name,
      connected: false,
      message: err instanceof Error ? err.message : `${name} failed to connect`,
      latencyMs: Math.round(performance.now() - start),
      checkedAt: new Date().toISOString(),
    };
  }
}

async function checkClients(context: any): Promise<TestClientSchema> {
  const [pg, sqlite, redis, s3, kafka] = await Promise.all([
    timed('PostgreSQL', async () => {
      const [row] = (await context.pg?.select().from(test).where(eq(test.key, 'Ping')).limit(1)) ?? [];
      return !!row;
    }),
    timed('SQLite', async () => {
      const [row] =
        (await context.sqlite?.select().from(sqliteTest).where(eq(sqliteTest.key, 'ping')).limit(1)) ??
        [];
      return !!row;
    }),
    timed('Redis', async () => (await context.redis?.ping()) === 'PONG'),
    timed(
      'S3',
      async () => !!(await context.rustfs?.send(new HeadBucketCommand({ Bucket: 'og-images' })))
    ),
    timed('Kafka', async () => !!(await context.producer?.metadata({ topics: ['health'] }))),
  ]);

  return { pg, sqlite, redis, s3, kafka };
}

export const ClientsRoute = base.tests.testClients.handler(async function* ({ context, signal }) {
  while (!signal?.aborted) {
    yield await checkClients(context);
    await Bun.sleep(3_000);
  }
});
