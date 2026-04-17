import { join } from 'path';
import type { SatoriOptions } from 'satori';

const FONTS_DIR = join(process.cwd(), 'public/fonts');

let _satoriOptions: SatoriOptions | null = null;

export async function getSatoriOptions(): Promise<SatoriOptions> {
  if (!_satoriOptions) {
    const file = Bun.file(join(FONTS_DIR, 'Inter-Bold.ttf'));
    if (!(await file.exists())) throw new Error(`Font not found: ${join(FONTS_DIR, 'Inter-Bold.ttf')}`);
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
    console.log('✅ Fonts loaded');
  }
  return _satoriOptions;
}
