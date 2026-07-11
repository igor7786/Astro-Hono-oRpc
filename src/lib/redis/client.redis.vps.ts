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
