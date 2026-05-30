// src/server/seo/og/cache.redis.ts
import { redisVps } from '@/lib/queues/redis.vps';

const OG_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function buildCacheKey(params: Record<string, string | undefined>): string {
  const normalized = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `og:image:${normalized}`;
}

export async function getCachedOgImage(key: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const cached = await redisVps.get(key); // string, not buffer
  if (!cached) return null;
  const binary = Uint8Array.from(atob(cached), (c) => c.charCodeAt(0));
  return new Uint8Array(binary.buffer as ArrayBuffer);
}

export async function setCachedOgImage(key: string, image: Uint8Array<ArrayBuffer>): Promise<void> {
  const base64 = btoa(String.fromCharCode(...image));
  await redisVps.set(key, base64, 'EX', OG_TTL_SECONDS);
}

export { buildCacheKey };
