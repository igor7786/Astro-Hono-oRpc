// src/server/handlers/og.handler.ts
import { Hono } from 'hono';
import { generateOgImage } from '@/lib/server/seo/og/generate';

export const og = new Hono();

og.get('/*', async (c) => {
  // strip leading /api/og/ prefix
  const raw = c.req.path.replace(/^\/api\/og\//, '');
  const [title, description, author, date] = raw.split('/').map(decodeURIComponent);

  console.log({ title, description, author, date });

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
});
