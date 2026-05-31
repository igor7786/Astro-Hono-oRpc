import { isUnKeysErrors } from '@/server/middlewares/un-keys-error';
import { base } from '@/server/procedures/base';
import { generateOgImage } from '@/server/seo/og/Generate';

export const ogRoute = base.use(isUnKeysErrors).seo.og.handler(async ({ input, context, errors }) => {
  const { title, description, author, date } = input;
  const accept = context.request?.headers.get('accept') ?? '';
  const format =
    accept.includes('image/webp') && !accept.includes('facebookexternalhit') ? 'webp' : 'png';

  // ✅ dynamic import — never runs at build time, only at request time
  const { getCachedOgImage, setCachedOgImage, buildCacheKey } =
    await import('@/server/seo/og/cache.redis');

  const cacheKey = buildCacheKey({ title, description, author, date, format });
  const cached = await getCachedOgImage(cacheKey).catch(() => null);

  if (cached) {
    const contentType = format === 'webp' ? 'image/webp' : 'image/png';
    return {
      body: new File([cached], 'og-image', { type: contentType }),
      headers: {
        Vary: 'Accept',
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="og-image.${format}"`,
        'Content-Length': cached.byteLength.toString(),
        'X-Cache': 'HIT',
      },
    };
  }

  const image = await generateOgImage(
    { title: title ?? 'Fast Web Tech', description, author, date },
    format
  ).catch(() => {
    throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to generate OG image' });
  });

  setCachedOgImage(cacheKey, image as Uint8Array<ArrayBuffer>).catch((err) =>
    console.error('Failed to cache OG image:', err.message)
  );

  const contentType = format === 'webp' ? 'image/webp' : 'image/png';
  return {
    body: new File([image as Uint8Array<ArrayBuffer>], 'og-image', { type: contentType }),
    headers: {
      Vary: 'Accept',
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="og-image.${format}"`,
      'Content-Length': (image as Uint8Array<ArrayBuffer>).byteLength.toString(),
      'X-Cache': 'MISS',
    },
  };
});
