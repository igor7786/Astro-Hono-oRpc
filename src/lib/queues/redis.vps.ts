import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';

let redisVps: Redis;
if (envServer.PRODUCTION === 'false') {
  console.log('⚠️ Running in development mode, connecting to remote VPS Redis with TLS...');
  redisVps = new Redis(envServer.VPS_REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    tls: {
      servername: envServer.VPS_TLS_SERVER,
      ca: await Bun.file(envServer.VPS_CA_CERT).text(),
      cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
      key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
      rejectUnauthorized: true,
    }, // ✅ required for rediss:// Upstash TLS
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true, // ✅ don't connect until first command
  });
} else {
  console.log('⚠️ Running in production mode, connecting to local Redis without TLS...');
  redisVps = new Redis(envServer.VPS_REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true, // ✅ don't connect until first command
  });
}

export { redisVps };
redisVps.on('connect', () => console.log('✅ Connected to DragonflyDB!'));
redisVps.on('error', (err) => console.error('❌ Redis error:', err.message));
try {
  const ping = await redisVps.ping();
  console.log('PING:', ping);

  await redisVps.set('og:test', 'hello world');
  console.log('SET og:test ✅');

  const value = await redisVps.get('og:test');
  console.log('GET og:test:', value);

  await redisVps.get('unauthorized:key');
} catch (err: any) {
  console.error('❌ Redis error ❌:', err?.message);
}

redisVps.on('connect', () => console.log('✅ Connected to DragonflyDB!'));
redisVps.on('error', (err) => console.error('❌ Redis error:', err.message));
