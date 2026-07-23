// src/server/seo/og/og.route.ts
import { eq } from 'drizzle-orm';

import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { ogImages } from '@/lib/drizzle/sqlite/schema';
import type { NewOgImage, OgImage } from '@/lib/drizzle/sqlite/schema';
import { isUnKeysErrors } from '@/server/middlewares/un-keys-error';
import { base } from '@/server/procedures/base';
import { buildCacheKey, getOrGenerate } from '@/server/seo/og/cache.redis';
import { generateOgImage } from '@/server/seo/og/Generate';
import { ogIdTokenServerSchema } from '@/server/seo/og/og.generate.token.id';

export const ogRoute = base.use(isUnKeysErrors).seo.og.handler(async ({ input, context, errors }) => {
  // input already passed Zod shape check from contract
  // now verify the HMAC token server-side
  const parsed = ogIdTokenServerSchema.safeParse(input);
  if (!parsed.success) {
    throw errors.UNAUTHORIZED({ message: 'Invalid OG token or ID 📛' });
  }

  let params: Record<string, string> | OgImage | null = null;

  try {
    const rows = await sqliteDb.select().from(ogImages).where(eq(ogImages.id, input.id)).limit(1);
    params = rows[0] ?? null;
  } catch (err) {
    console.error('[error] SQLite unavailable, will try manifest fallback');
    // params stays null — handled below alongside the "not found" case
    params = null;
    throw errors.INTERNAL_SERVER_ERROR({ message: 'SQLite unavailable 📛' });
  }

  if (!params) {
    throw errors.INPUT_VALIDATION_FAILED({ message: 'No OG image found 📛' });
  }
  const { title, description, author, date: dateStr } = params;
  const date = dateStr
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr))
    : undefined;
  // ------------------------------------------------------------------
  // Format negotiation — prefer WebP unless the requester is a crawler
  // that doesn't support it (e.g. Facebook's scraper)
  // ------------------------------------------------------------------
  const accept = context.request?.headers.get('accept') ?? '';
  const format =
    input.format ??
    (accept.includes('image/webp') && !accept.includes('facebookexternalhit') ? 'webp' : 'png');

  const contentType = format === 'webp' ? 'image/webp' : 'image/png';

  // ------------------------------------------------------------------
  // Build a stable, hashed cache key from all inputs
  // ------------------------------------------------------------------
  const cacheKey = buildCacheKey({ title, description, author, date, format });

  // ------------------------------------------------------------------
  // Try cache first; generate only on miss.
  // getOrGenerate deduplicates concurrent misses for the same key so
  // only one generateOgImage call runs per unique set of params.
  //
  // If the cache layer itself throws (e.g. Redis unreachable and the
  // failure isn't handled inside getOrGenerate), fall back to generating
  // directly so the request still succeeds — just without caching.
  // ------------------------------------------------------------------
  let image: Uint8Array;
  let tier: string;

  try {
    const result = await getOrGenerate(
      cacheKey,
      async () =>
        generateOgImage({ title: title ?? 'Fast Web Tech', description, author, date }, format).catch(
          () => {
            throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to generate OG image' });
          }
        ),
      { format, title }
    );
    image = result.image;
    tier = result.tier;
  } catch (err: any) {
    console.error('[error] Cache layer unavailable, generating without cache', err.message);
    image = await generateOgImage(
      { title: title ?? 'Fast Web Tech', description, author, date },
      format
    ).catch(() => {
      throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to generate OG image' });
    });
    tier = 'uncached';
  }

  const isHit = tier !== 'miss' && tier !== 'uncached';

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
      'X-Cache-Tier': tier,
    },
  };
});
