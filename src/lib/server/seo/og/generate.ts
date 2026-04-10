import satori, { type SatoriOptions } from 'satori';
import sharp from 'sharp';
import { join } from 'path';
import { SocialCard, type SocialCardProps } from './SocialCard';

const FONTS_DIR = join(process.cwd(), 'public/fonts');

let _satoriOptions: SatoriOptions | null = null;

async function getSatoriOptions(): Promise<SatoriOptions> {
  if (!_satoriOptions) {
    const file = Bun.file(join(FONTS_DIR, 'Inter-Bold.ttf'));
    if (!(await file.exists())) throw new Error('Inter-Bold.ttf not found in public/fonts/');
    const fontData = await file.arrayBuffer();

    _satoriOptions = {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontData, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontData, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontData, weight: 800, style: 'normal' },
      ],
    };
  }
  return _satoriOptions;
}

export async function generateOgImage(props: SocialCardProps): Promise<Buffer> {
  const options = await getSatoriOptions();

  const svg = await satori(SocialCard(props) as any, options);

  // ✅ sharp — better compression than resvg
  return sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      quality: 80,
    })
    .toBuffer();
}
