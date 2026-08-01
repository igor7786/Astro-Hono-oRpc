// src/lib/redis/client.redis.vps.ts
import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

async function createRedisClient(): Promise<Redis> {
  if (envServer.PRODUCTION === 'false') {
    const { tls } = await import('@/lib/tls/client.tls');
    console.log('⚠️ [Redis] Running in development mode, connecting to remote VPS Redis with TLS...');
    return new Redis(envServer.VPS_REDIS_URL, {
      connectTimeout: 200,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      tls: await tls(),
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
    });
  }

  console.log('✅ [Redis] Running in production mode, connecting to local Redis without TLS...');
  return new Redis(envServer.PROD_REDIS_URL, {
    connectTimeout: 200,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });
}

// Single promise — created once, resolved once, reused forever
export const redisVps = await createRedisClient();
redisVps.on('error', (err: Error) => console.error('❌ Redis error: FAILED TO CONNECT', err.message));
