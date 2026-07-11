// src/server/seo/og/cache.redis.ts
import { createHash } from 'node:crypto';

import { redisVps } from '@/lib/redis/client.redis.vps';

// src/server/seo/og/og.route.ts

const OG_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const CACHE_VERSION = 'v1';

// ---------------------------------------------------------------------------
// Key builder
// ---------------------------------------------------------------------------

export function buildCacheKey(params: Record<string, string | undefined>): string {
  const normalized = Object.entries(params)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');

  const hash = createHash('sha256').update(normalized).digest('hex');
  return `og:image:${CACHE_VERSION}:${hash}`;
}

// ---------------------------------------------------------------------------
// Redis I/O  — uses getBuffer to avoid base64 overhead (~33% less memory)
// ---------------------------------------------------------------------------

export async function getCachedOgImage(key: string): Promise<Uint8Array | null> {
  const buf = await redisVps.getBuffer(key);
  if (!buf) return null;
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export async function setCachedOgImage(key: string, image: Uint8Array): Promise<void> {
  await redisVps.set(key, Buffer.from(image), 'EX', OG_TTL_SECONDS);
}

export async function deleteCachedOgImage(key: string): Promise<void> {
  await redisVps.del(key);
}

// ---------------------------------------------------------------------------
// In-flight deduplication — prevents thundering herd on cache miss
// ---------------------------------------------------------------------------

const inFlight = new Map<string, Promise<Uint8Array>>();

export async function getOrGenerate(
  key: string,
  generate: () => Promise<Uint8Array>
): Promise<Uint8Array> {
  // 1. Cache hit — return immediately
  const cached = await getCachedOgImage(key);
  if (cached) return cached;

  // 2. Already generating — reuse the same promise
  const existing = inFlight.get(key);
  if (existing) return existing;

  // 3. Cache miss — generate once, cache, then resolve all waiters
  const promise = generate()
    .then(async (image) => {
      await setCachedOgImage(key, image).catch((err) =>
        console.error('[og-cache] Failed to cache image:', err)
      );
      return image;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
}
