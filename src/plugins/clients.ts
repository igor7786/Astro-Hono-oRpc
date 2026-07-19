import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';

import { ogTest } from '@/lib/drizzle/pg/pg.schema';
import { test } from '@/lib/drizzle/sqlite/schema';

async function loadClients() {
  // Load clients or perform any necessary setup here
  const { envServer } = await import('@/lib/env/server.env.ts');
  const { sqliteDb } = await import('@/lib/drizzle/sqlite/client.ts');
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
    });

    console.log('[server] REDPANDA -> ✅');
  } catch {
    console.error('[error] REDPANDA -> ❌');
  }

  try {
    await db.select().from(ogTest).where(eq(ogTest.key, 'og:test'));

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
    await Promise.all([
      redisVps.quit(),
      producer.close(),
      db.$client.end(),
      rustfsClient.destroy(),
      sqliteDb.$client.close(),
    ]);

    console.log(`[server] ${signal} — shutdown complete`);

    // Let the process exit naturally instead of forcing it
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
