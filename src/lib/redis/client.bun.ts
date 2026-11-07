// src/lib/redis/client.redis.vps.ts
import { RedisClient } from 'bun';

import { envServer } from '@/lib/env/server.env';

async function createRedisClient(): Promise<RedisClient> {
  const isDev = envServer.PRODUCTION === 'false';

  console.log(
    isDev
      ? '⚠️ [Redis] Running in development mode, connecting to remote VPS with mTLS...'
      : '✅ [Redis] Running in production mode, connecting without TLS...'
  );

  const ssl = isDev ? await (await import('@/lib/tls/client.tls')).tls() : undefined;
  const url = isDev ? envServer.VPS_REDIS_URL : envServer.PROD_REDIS_URL;

  // Your TLS helper uses the ioredis spelling `servername`. Bun's option is `serverName`.
  const tls = ssl ? (({ servername, ...rest }) => ({ ...rest, serverName: servername }))(ssl) : false;

  const client = new RedisClient(url, {
    connectionTimeout: 200, // same value as before. Raise it if the remote mTLS handshake is slow.
    maxRetries: 3,
    autoReconnect: true,
    // No idleTimeout: when it fires, Bun closes the connection and does not reconnect by itself.
    tls,
  });

  // Replaces ioredis `redisVps.on('error', ...)`
  client.onclose = (error) => {
    console.error('❌ Redis connection closed:', error?.message ?? 'no error');
  };

  return client;
}

// Created once, reused everywhere
export const redisVps = await createRedisClient();
