// src/lib/server/seo/og/generate.ts

import { ImageResponse } from '@takumi-rs/image-response';
import { SocialCard, type SocialCardProps } from './SocialCard';
import { getCacheKey, getFromCache, setToCache } from './cache';

export async function generateOgImage(props: SocialCardProps): Promise<Uint8Array> {
  // const cacheKey = getCacheKey(props);

  // // ✅ Check cache
  // const cached = await getFromCache(cacheKey);
  // if (cached) return cached;

  // console.log(`[OG] Cache miss — generating: ${cacheKey}`);

  const response = new ImageResponse(<SocialCard {...props} />, {
    width: 1200,
    height: 630,
    format: 'png',
  });

  const buffer = new Uint8Array(await response.arrayBuffer());

  // ✅ Store in cache
  // await setToCache(cacheKey, Buffer.from(buffer));

  return buffer;
}
