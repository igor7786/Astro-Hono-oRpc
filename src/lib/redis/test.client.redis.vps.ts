import { redisVps } from '@/lib/redis/client.redis.vps';

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
} finally {
  try {
    await redisVps.quit();
  } catch (quitErr: any) {
    console.error('❌ Redis quit error ❌:', quitErr?.message);
  } finally {
    await redisVps.disconnect(); // force-close the socket regardless of quit()'s outcome
  }
}
