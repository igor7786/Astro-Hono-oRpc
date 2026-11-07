// src/lib/redis/test.client.redis.vps.ts
import { redisVps } from '@/lib/redis/client.bun';

// ioredis `on('connect')` / `on('error')` became callbacks on the client
redisVps.onconnect = () => console.log('✅ Connected to DragonflyDB!');
redisVps.onclose = (err) => console.error('❌ Redis connection closed:', err?.message ?? 'no error');

try {
  await redisVps.connect(); // connect explicitly instead of waiting for the first command

  const ping = await redisVps.send('PING', []);
  console.log('PING:', ping);

  await redisVps.set('og:test', 'hello world');
  console.log('SET og:test ✅');

  const value = await redisVps.get('og:test');
  console.log('GET og:test:', value);

  // Expected to fail if your ACL user cannot read this key
  await redisVps.get('unauthorized:key');
} catch (err: unknown) {
  console.error('❌ Redis error ❌:', err instanceof Error ? err.message : err);
} finally {
  // Bun has no quit()/disconnect(): close() ends the connection
  try {
    redisVps.close();
  } catch (closeErr: unknown) {
    console.error('❌ Redis close error ❌:', closeErr instanceof Error ? closeErr.message : closeErr);
  }
}
