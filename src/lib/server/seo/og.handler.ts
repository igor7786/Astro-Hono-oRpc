import { Hono } from 'hono';
import { generateOgImage } from '@/lib/server/seo/og/Generate';

export const og = new Hono();

og.get('/*', async (c) => {
  const title = c.req.query('title') ?? 'Fast Web Tech';
  const description = c.req.query('description') ?? undefined;
  const author = c.req.query('author') ?? undefined;
  const date = c.req.query('date') ?? undefined;

  try {
    const image = await generateOgImage({
      title,
      description,
      author,
      date,
    });

    return new Response(new Uint8Array(image), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[OG] Failed:', error);
    return c.json({ error: 'Failed to generate OG image' }, 500);
  }
});

export default og;
