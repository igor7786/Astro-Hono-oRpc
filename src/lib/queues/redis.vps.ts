import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

export const redisVps = new Redis(envServer.VPS_REDIS_URL, {
  enableReadyCheck: false,
  tls: { servername: envServer.VPS_TLS_SERVER }, // ✅ required for rediss:// Upstash TLS
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true, // ✅ don't connect until first command
});
redisVps.on('connect', () => console.log('✅ Connected to DragonflyDB!'));
redisVps.on('error', (err) => console.error('❌ Redis error:', err.message));

const ping = await redisVps.ping();
console.log('PING:', ping);

await redisVps.set('og:test', 'hello world');
console.log('SET og:test ✅');

const value = await redisVps.get('og:test');
console.log('GET og:test:', value);

try {
  await redisVps.get('unauthorized:key');
} catch (err: any) {
  console.error('GET unauthorized:', err?.message);
}

process.exit(0);
