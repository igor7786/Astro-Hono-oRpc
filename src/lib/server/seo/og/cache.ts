// src/lib/server/seo/og/cache.ts
import { redis } from '@/lib/queues/redis';
import type { SocialCardProps } from '@server/seo/og/SocialCard';

const OG_CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
const KEY_PREFIX = 'og:';

export function getCacheKey(props: SocialCardProps): string {
  const { title, description, author, date, siteName, siteUrl } = props;
  return `${KEY_PREFIX}${[title, description, author, date, siteName, siteUrl]
    .map((v) => v ?? '')
    .join('|')}`;
}

export async function getFromCache(key: string): Promise<Uint8Array | null> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[OG] Cache hit: ${key}`);
      return Uint8Array.from(Buffer.from(cached, 'base64'));
    }
  } catch (err) {
    console.error('[OG] Redis read error:', err);
  }
  return null;
}

export async function setToCache(key: string, png: Buffer): Promise<void> {
  try {
    await redis.set(key, png.toString('base64'), 'EX', OG_CACHE_TTL);
    console.log(`[OG] Cached for ${OG_CACHE_TTL}s: ${key}`);
  } catch (err) {
    console.error('[OG] Redis write error:', err);
  }
}
