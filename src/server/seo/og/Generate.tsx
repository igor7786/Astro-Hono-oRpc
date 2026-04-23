import { ImageResponse } from '@takumi-rs/image-response';

import { SocialCard, type SocialCardProps } from '@/server/seo/og/SocialCard';

type OgFormat = 'png' | 'webp';

export async function generateOgImage(
  props: SocialCardProps,
  format: OgFormat = 'png'
): Promise<Uint8Array> {
  const response = new ImageResponse(<SocialCard {...props} />, {
    width: 1200,
    height: 630,
    format,
  });

  return new Uint8Array(await response.arrayBuffer());
}
