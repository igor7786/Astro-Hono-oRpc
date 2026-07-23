import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { ProduceAcks } from '@platformatic/kafka';
import { eq } from 'drizzle-orm';

import { test as testPg } from '../lib/drizzle/pg/pg.schema';
import { test } from '../lib/drizzle/sqlite/schema';

async function loadClients() {
  // Load clients or perform any necessary setup here
  const { envServer } = await import('@/lib/env/server.env.ts');
  const { sqliteDb, closeSqlite } = await import('@/lib/drizzle/sqlite/client.ts');
  const { redisVps } = await import('@/lib/redis/client.redis.vps.ts');
  const { producer } = await import('@/lib/redpanda-kafka/producer.ts');
  const { db } = await import('@/lib/drizzle/pg/client.pg.db');
  const { rustfsClient } = await import('@/lib/s3/client.rustfs.vps.ts');
  console.log('[server] PRODUCTION ->', envServer.PRODUCTION === 'true' ? '✅' : '❌');
  try {
    await sqliteDb.select().from(test).where(eq(test.key, 'ping'));
    console.log('[server] SQLITE DRIZZLE ->', '✅');
  } catch (e) {
    console.error('[error] SQLITE DRIZZLE -> ❌');
  }
  try {
    await redisVps.ping();
    console.log('[server] REDIS -> ✅');
  } catch (e) {
    console.error('[error] REDIS -> ❌');
  }

  try {
    await producer.send({
      messages: [
        {
          topic: 'health',
          key: 'health',
          value: JSON.stringify({
            event: 'test',
            name: 'ok',
            timestamp: Date.now(),
          }),
          headers: {
            source: 'web-app',
          },
        },
      ],
      acks: ProduceAcks.LEADER,
    });

    console.log('[server] REDPANDA -> ✅');
  } catch {
    console.error('[error] REDPANDA -> ❌');
  }

  try {
    await db.select().from(testPg).where(eq(testPg.key, 'og:test'));

    console.log('[server] POSTGRES DRIZZLE ->', '✅');
  } catch (err: any) {
    console.error('[error] POSTGRES DRIZZLE -> ❌');
  }

  try {
    await rustfsClient.send(new ListBucketsCommand({}));
    console.log('[server] RUSTFS -> ✅');
  } catch {
    console.error('[error] RUSTFS -> ❌');
  }
  // all imports scoped here — shutdown can access via closure
  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} — shutting down...`);

    const results = await Promise.allSettled([
      redisVps.disconnect(),
      producer.close(),
      db.$client.end(),
      rustfsClient.destroy(),
      closeSqlite(),
    ]);
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        const names = ['redis', 'kafka producer', 'postgres', 'rustfs', 'sqlite'];
        console.error(`[error] shutdown of ${names[i]} failed:`, result.reason);
      }
    });
    console.log(`[server] ${signal} — shutdown complete`);
    process.exit(0);
  };

  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));
}

export default function serverStartup() {
  return {
    name: 'server-startup',
    hooks: {
      'astro:server:setup': async () => {
        await loadClients();
      },
      // 'astro:build:start': async () => {
      //   await loadClients();
      // },
    },
  };
}
