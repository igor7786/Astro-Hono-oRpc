import Redis from 'ioredis';

import { envServer } from '@/lib/env/server.env';
import { tls } from '@/lib/tls/client.tls';

let redisVps: Redis;
if (envServer.PRODUCTION === 'false') {
  console.log('⚠️ Running in development mode, connecting to remote VPS Redis with TLS...');
  redisVps = new Redis(envServer.VPS_REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    tls: await tls(), // Use the TLS configuration for secure connection
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true, // ✅ don't connect until first command
  });
} else {
  console.log('✅ Running in production mode, connecting to local Redis without TLS...');
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
