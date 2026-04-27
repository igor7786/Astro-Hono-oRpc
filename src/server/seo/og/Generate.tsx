import { ImageResponse } from '@takumi-rs/image-response';

import { SocialCard, type SocialCardProps } from '@/server/seo/og/SocialCard';

import { getSatoriOptions } from './fonts';

type OgFormat = 'png' | 'webp';

export async function generateOgImage(
  props: SocialCardProps,
  format: OgFormat = 'png'
): Promise<Uint8Array> {
  const satoriOptions = await getSatoriOptions().catch((err) => {
    throw new Error(`Failed to load fonts for OG image generation: ${err.message}`);
  }); // ✅ CALL IT

  const response = new ImageResponse(<SocialCard {...props} />, {
    ...satoriOptions, // ✅ includes fonts, width, height
    format,
  });

  return new Uint8Array(await response.arrayBuffer());
}
