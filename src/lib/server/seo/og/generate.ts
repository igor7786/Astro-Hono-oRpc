// src/lib/server/seo/og/generate.ts
import satori from 'satori';
import sharp from 'sharp';
import { SocialCard, type SocialCardProps } from './SocialCard';
import { getSatoriOptions } from './fonts';
import { getCacheKey, getFromCache, setToCache } from './cache';

async function generatePng(props: SocialCardProps): Promise<Buffer> {
  const options = await getSatoriOptions();
  const svg = await satori(SocialCard(props) as any, options);

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true, quality: 80 })
    .toBuffer();
}

export async function generateOgImage(props: SocialCardProps): Promise<Uint8Array> {
  const cacheKey = getCacheKey(props);

  // ✅ check cache first
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  console.log(`[OG] Cache miss — generating: ${cacheKey}`);

  // ✅ generate
  const png = await generatePng(props);

  // ✅ cache for next time
  await setToCache(cacheKey, png);

  return new Uint8Array(png);
}
