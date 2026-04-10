import { Hono } from 'hono';
import { generateOgImage } from '@/lib/server/seo/og/Generate';

export const og = new Hono();

og.get('/*', async (c) => {
  const raw = c.req.path.replace(/^\/api\/og\//, '');
  const [title, description, author, date] = raw.split('/').map(decodeURIComponent);

  try {
    const png = await generateOgImage({
      title: title || 'Fast Web Tech',
      description: description || undefined,
      author: author || undefined,
      date: date || undefined,
    });

    return new Response(new Uint8Array(png), {
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
