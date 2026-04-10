import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { join } from 'path';
import { SocialCard, type SocialCardProps } from './SocialCard';

const FONTS_DIR = join(process.cwd(), 'public/fonts');

let _fontBuffer: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (!_fontBuffer) {
    const path = join(FONTS_DIR, 'Inter-Bold.ttf');
    const file = Bun.file(path);
    if (!(await file.exists())) throw new Error(`Font not found: ${path}`);
    _fontBuffer = await file.arrayBuffer();
    console.log('✅ Inter font loaded');
  }
  return _fontBuffer;
}

export async function generateOgImage(props: SocialCardProps): Promise<Uint8Array> {
  const fontBuffer = await getFont();

  const svg = await satori(SocialCard(props) as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontBuffer, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBuffer, weight: 700, style: 'normal' },
      { name: 'Inter', data: fontBuffer, weight: 800, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}
