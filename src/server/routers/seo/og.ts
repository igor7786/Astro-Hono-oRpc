// src/server/seo/og/og.route.ts
import { isUnKeysErrors } from '@/server/middlewares/un-keys-error';
import { base } from '@/server/procedures/base';
import { generateOgImage } from '@/server/seo/og/Generate';

export const ogRoute = base.use(isUnKeysErrors).seo.og.handler(async ({ input, context, errors }) => {
  const { title, description, author, date } = input;

  // ------------------------------------------------------------------
  // Format negotiation — prefer WebP unless the requester is a crawler
  // that doesn't support it (e.g. Facebook's scraper)
  // ------------------------------------------------------------------
  const accept = context.request?.headers.get('accept') ?? '';
  const format =
    input.format ??
    (accept.includes('image/webp') && !accept.includes('facebookexternalhit') ? 'webp' : 'png');

  const { getOrGenerate, buildCacheKey } = await import('@/server/seo/og/cache.redis');

  const contentType = format === 'webp' ? 'image/webp' : 'image/png';

  // ------------------------------------------------------------------
  // Build a stable, hashed cache key from all inputs
  // ------------------------------------------------------------------
  const cacheKey = buildCacheKey({ title, description, author, date, format });

  // ------------------------------------------------------------------
  // Try cache first; generate only on miss.
  // getOrGenerate deduplicates concurrent misses for the same key so
  // only one generateOgImage call runs per unique set of params.
  // ------------------------------------------------------------------
  let isHit = true;

  const image = await getOrGenerate(cacheKey, async () => {
    isHit = false;
    return generateOgImage(
      {
        title: title ?? 'Fast Web Tech',
        description,
        author,
        date,
      },
      format
    ).catch(() => {
      throw errors.INTERNAL_SERVER_ERROR({
        message: 'Failed to generate OG image',
      });
    });
  });

  // ------------------------------------------------------------------
  // Build the File object once so we use .size for Content-Length
  // (image.byteLength would be correct too, but .size is canonical
  // for File and keeps things consistent)
  // ------------------------------------------------------------------
  const file = new File([image as Uint8Array<ArrayBuffer>], `og-image.${format}`, { type: contentType });

  return {
    body: file,
    headers: {
      Vary: 'Accept',
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="og-image.${format}"`,
      'Content-Length': file.size.toString(),
      'X-Cache': isHit ? 'HIT' : 'MISS',
    },
  };
});
