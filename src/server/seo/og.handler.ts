import { Hono } from 'hono';
import { generateOgImage } from '@/server/seo/og/Generate';
import { seoQuerySchema } from '@/components/astrocomp/layout/seo.schema';
import { zValidator } from '@hono/zod-validator';

export const og = new Hono();

og.get('/og', zValidator('query', seoQuerySchema), async (c) => {
  const { title, description, author, date } = c.req.valid('query');

  const accept = c.req.header('accept') ?? '';

  const isWebp = accept.includes('image/webp') && !accept.includes('facebookexternalhit');

  const format = isWebp ? 'webp' : 'png';

  try {
    const image = await generateOgImage(
      {
        title: title ?? 'Fast Web Tech',
        description,
        author,
        date,
      },
      format
    );

    return new Response(new Uint8Array(image), {
      headers: {
        'Content-Type': format === 'webp' ? 'image/webp' : 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[OG] Failed:', error);
    return c.json({ error: 'Failed to generate OG image' }, 500);
  }
});

export default og;
