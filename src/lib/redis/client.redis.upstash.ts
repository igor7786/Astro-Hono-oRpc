// src/lib/server/redis.ts
import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

export const redisUpstash = new Redis(envServer.UPSTASH_REDIS_URL, {
  tls: {}, // ✅ required for rediss:// Upstash TLS
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true, // ✅ don't connect until first command
});

redisUpstash.on('connect', () => console.log('✅ Redis connected'));
redisUpstash.on('error', (err) => console.error('❌ Redis error:', err.message));

// ✅ explicit test — call this once at app startup, not on every import
(async () => {
  try {
    await redisUpstash.set('ping', 'pong');
    const val = await redisUpstash.get('ping');
    console.log('Upstash Redis connection OK:', val); // should print "pong"
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();
