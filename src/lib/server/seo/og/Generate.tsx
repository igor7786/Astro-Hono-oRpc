// src/lib/server/seo/og/generate.ts

import { ImageResponse } from '@takumi-rs/image-response';
import { SocialCard, type SocialCardProps } from '@server/seo/og/SocialCard';

export async function generateOgImage(props: SocialCardProps): Promise<Uint8Array> {
  const response = new ImageResponse(<SocialCard {...props} />, {
    width: 1200,
    height: 630,
    format: 'png',
  });

  const buffer = new Uint8Array(await response.arrayBuffer());
  return buffer;
}
