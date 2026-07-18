// src/server/seo/og/cache.redis.ts
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { createHash } from 'node:crypto';

import { redisVps } from '@/lib/redis/client.redis.vps';
// your S3-compatible client
import { producer } from '@/lib/redpanda-kafka/producer';
import { rustfsClient } from '@/lib/s3/client.rustfs.vps';

// lazy singleton, mirrors your other producers

const OG_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days — Dragonfly hot tier
const CACHE_VERSION = 'v1';
const RUSTFS_BUCKET = 'og-images';

type CacheTier = 'redis' | 'rustfs' | 'miss';
// await rustfsClient.send(new CreateBucketCommand({ Bucket: 'og-images' }));

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

// key -> object path is a 1:1 mapping, keep them aligned
function keyToRustfsPath(key: string): string {
  return `${key}.bin`;
}

// ---------------------------------------------------------------------------
// Tier 1: Dragonfly (hot)
// ---------------------------------------------------------------------------

async function getFromRedis(key: string): Promise<Uint8Array | null> {
  const buf = await redisVps.getBuffer(key);
  if (!buf) return null;
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

async function setInRedis(key: string, image: Uint8Array): Promise<void> {
  await redisVps.set(key, Buffer.from(image), 'EX', OG_TTL_SECONDS);
}

export async function deleteCachedOgImage(key: string): Promise<void> {
  await Promise.all([
    redisVps.del(key),
    rustfsClient
      .send(
        new DeleteObjectCommand({
          Bucket: RUSTFS_BUCKET,
          Key: keyToRustfsPath(key),
        })
      )
      .catch(() => {}),
  ]);
}

// ---------------------------------------------------------------------------
// Tier 2: RustFS (durable)
// ---------------------------------------------------------------------------

async function getFromRustfs(key: string): Promise<Uint8Array | null> {
  try {
    const res = await rustfsClient.send(
      new GetObjectCommand({ Bucket: RUSTFS_BUCKET, Key: keyToRustfsPath(key) })
    );
    if (!res.Body) return null;
    return await res.Body.transformToByteArray();
  } catch (err) {
    if ((err as { name?: string }).name !== 'NoSuchKey') {
      console.error('[og-cache] RustFS read error:', err);
    }
    return null;
  }
}

async function setInRustfs(key: string, image: Uint8Array): Promise<void> {
  await rustfsClient.send(
    new PutObjectCommand({
      Bucket: RUSTFS_BUCKET,
      Key: keyToRustfsPath(key),
      Body: Buffer.from(image),
    })
  );
}

// ---------------------------------------------------------------------------
// In-flight dedup — prevents thundering herd on cache miss
// ---------------------------------------------------------------------------

const inFlight = new Map<string, Promise<Uint8Array>>();

// ---------------------------------------------------------------------------
// Orchestration: Redis -> RustFS -> generate, with backfill on the way up
// ---------------------------------------------------------------------------

export async function getOrGenerate(
  key: string,
  generate: () => Promise<Uint8Array>,
  meta: { format: string; title?: string }
): Promise<{ image: Uint8Array; tier: CacheTier }> {
  // 1. Dragonfly hit
  const fromRedis = await getFromRedis(key);
  if (fromRedis) {
    void emitCacheEvent('redis', key, meta);
    return { image: fromRedis, tier: 'redis' };
  }

  // 2. Already generating — reuse the same promise
  const existing = inFlight.get(key);
  if (existing) {
    const image = await existing;
    return { image, tier: 'miss' }; // this waiter didn't trigger generation itself
  }

  // 3. RustFS hit — backfill Dragonfly, no need to regenerate
  const fromRustfs = await getFromRustfs(key);
  if (fromRustfs) {
    void setInRedis(key, fromRustfs).catch((err) =>
      console.error('[og-cache] Failed to backfill Redis from RustFS:', err)
    );
    void emitCacheEvent('rustfs', key, meta);
    return { image: fromRustfs, tier: 'rustfs' };
  }

  // 4. Full miss — generate once, write to both tiers, resolve all waiters
  const promise = generate()
    .then(async (image) => {
      await Promise.all([
        setInRedis(key, image).catch((err) =>
          console.error('[og-cache] Failed to cache in Redis:', err.message)
        ),
        setInRustfs(key, image).catch((err) =>
          console.error('[og-cache] Failed to cache in RustFS:', err.message)
        ),
      ]);
      void emitCacheEvent('miss', key, meta);
      return image;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  const image = await promise;
  return { image, tier: 'miss' };
}

// ---------------------------------------------------------------------------
// Analytics — fire-and-forget event to Redpanda
// ---------------------------------------------------------------------------

async function emitCacheEvent(
  tier: CacheTier,
  key: string,
  meta: { format: string; title?: string }
): Promise<void> {
  try {
    // lazy singleton — reused across calls
    await producer.send({
      messages: [
        {
          topic: 'og_image',
          key,
          value: JSON.stringify({
            tier,
            key,
            format: meta.format,
            title: meta.title,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    // await producer.close();
    // no close/disconnect here — producer stays alive for the next request
  } catch (err) {
    console.error('[og-cache] Failed to emit Redpanda event:', err);
  }
}
