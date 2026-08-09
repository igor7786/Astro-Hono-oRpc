// src/lib/redis/client.redis.vps.ts
import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

async function createRedisClient(): Promise<Redis> {
  envServer.PRODUCTION === 'false'
    ? console.log('⚠️ [Redis] Running in development mode, connecting to remote VPS with mTLS...')
    : console.log('✅ [Redis] Running in production mode, connecting without TLS...');
  const ssl =
    envServer.PRODUCTION === 'false' ? await (await import('@/lib/tls/client.tls')).tls() : undefined;
  const url = envServer.PRODUCTION === 'false' ? envServer.VPS_REDIS_URL : envServer.PROD_REDIS_URL;
  return new Redis(url, {
    // protocol: 3,
    connectTimeout: 200,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    tls: ssl,
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
