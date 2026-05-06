import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

const redis = new Redis(envServer.VPS_REDIS_URL, {
  tls: {
    servername: 'redis.fast-web-tech.co.uk',
  },
  enableReadyCheck: false,
});

redis.on('connect', () => console.log('✅ Connected to DragonflyDB!'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

const ping = await redis.ping();
console.log('PING:', ping);

await redis.set('og:test', 'hello world');
console.log('SET og:test ✅');

const value = await redis.get('og:test');
console.log('GET og:test:', value);

try {
  await redis.get('unauthorized:key');
} catch (err: any) {
  console.error('GET unauthorized:', err?.message || err);
}

process.exit(0);
