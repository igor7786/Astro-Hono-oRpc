import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const ogHandler = new Hono();

export async function og(title: string) {
  const safeTitle = String(title ?? 'Default Title').slice(0, 80);

  // 📦 load font
  const font = await readFile(new URL('../../../../public/fonts/Inter-Bold.ttf', import.meta.url));

  // 🎨 template (keep as any for now if needed)
  const element = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        padding: '60px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: '20px',
              color: '#6b7280',
              marginBottom: '20px',
            },
            children: 'My API',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '64px',
              fontWeight: 700,
              color: '#111827',
              textAlign: 'center',
              maxWidth: '1000px',
              lineHeight: 1.2,
            },
            children: safeTitle,
          },
        },
      ],
    },
  } as any;

  // 🧩 generate SVG
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // 🖼 convert to PNG
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const png = resvg.render().asPng();

  return new Uint8Array(png);
}

ogHandler.get('/og', async (c) => {
  const rawTitle = c.req.query('title') ?? 'Default Title';

  // 🔒 sanitize input
  const title = String(rawTitle).slice(0, 80);

  // ⚡ cache check
  // if (cache.has(title)) {
  //   return c.body(cache.get(title)!, 200, {
  //     'Content-Type': 'image/png',
  //     'Cache-Control': 'public, max-age=31536000, immutable',
  //   });
  // }

  // 📦 load local font (FAST + RELIABLE)

  const image = await og(title);

  // // 💾 store in cache
  // cache.set(title, buffer);

  if (!image) {
    return c.text('Failed to generate OG image', 500);
  }
  // 🚀 response
  return c.body(image, 200, {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  });
});
