import { isUnKeysErrors } from '@/server/middlewares/un-keys-error';
import { base } from '@/server/procedures/base';
import { generateOgImage } from '@/server/seo/og/Generate';

export const ogRoute = base.use(isUnKeysErrors).seo.og.handler(async ({ input, context, errors }) => {
  const { title, description, author, date } = input;

  const accept = context.request?.headers.get('accept') ?? '';
  // webp unless it's a bot/crawler that doesn't support it
  const format =
    accept.includes('image/webp') && !accept.includes('facebookexternalhit') ? 'webp' : 'png';

  const image = await generateOgImage(
    {
      title: title ?? 'Fast Web Tech',
      description,
      author,
      date,
    },
    format
  ).catch((_err) => {
    throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to generate OG image' });
  });

  const contentType = format === 'webp' ? 'image/webp' : 'image/png'; // derive once

  return {
    body: new File([image as Uint8Array<ArrayBuffer>], 'og-image', { type: contentType }),

    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': 'inline; filename="og-image.' + format + '"',
    },
  };
});
