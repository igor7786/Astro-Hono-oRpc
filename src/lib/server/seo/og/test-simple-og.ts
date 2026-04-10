// src/lib/og/test-simple-og.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

async function testSimple() {
  // 1️⃣ Fetch font as ArrayBuffer
  const fontBuffer = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf'
  ).then((r) => r.arrayBuffer());

  // 2️⃣ Minimal valid VNode tree
  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1200,
        height: 630,
        background: '#0f172a',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { fontSize: 48, fontWeight: 700 },
            children: 'Hello Satori!',
          },
        },
      ],
    },
  };

  // 3️⃣ ✅ CRITICAL: Use `data:` not `fontData:`
  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: fontBuffer, weight: 400, style: 'normal' }],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = Buffer.from(resvg.render().asPng());

  console.log('✅ Simple test passed:', png.length, 'bytes');
}

testSimple().catch(console.error);
