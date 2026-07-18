import { ListBucketsCommand } from '@aws-sdk/client-s3';

async function loadClients() {
  // Load clients or perform any necessary setup here
  const { envServer } = await import('@/lib/env/server.env.ts');
  const { redisVps } = await import('@/lib/redis/client.redis.vps.ts');
  const { producer } = await import('@/lib/redpanda-kafka/producer.ts');
  const { db } = await import('@/lib/drizzle/client.pg.db');
  const { rustfsClient } = await import('@/lib/s3/client.rustfs.vps.ts');

  console.log('[server] PRODUCTION -> variables:', envServer.PRODUCTION === 'true' ? '✅' : '❌');
  console.log('[server] REDIS -> connection status:', (await redisVps.ping()) ? '✅' : '❌');
  console.log('[server] REDPANDA -> producer status:', producer.closed ? '❌' : '✅');
  // const result = await db.select().from(ogTest).where(eq(ogTest.key, 'og:test'));
  console.log('[server] POSTGRES, DRIZZLE -> :', (await db.$client.connect()) ? '✅' : '❌');
  console.log(
    '[server] RUSTFS -> connection status:',
    (await rustfsClient.send(new ListBucketsCommand({}))) ? '✅' : '❌'
  );

  // all imports scoped here — shutdown can access via closure
  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} — shutting down...`);
    await Promise.all([redisVps.quit(), producer.close(), db.$client.end(), rustfsClient.destroy()]);

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
