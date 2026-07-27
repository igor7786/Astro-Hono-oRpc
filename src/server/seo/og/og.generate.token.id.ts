// src/lib/seo/og/generate.token.id.ts
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

import { envServer } from '@/lib/env/server.env';
import { type OgRecord } from '@/lib/shared/schemas/seo.schema';

export function generateOgToken(id: string): string {
  return createHmac('sha256', envServer.OG_SECRET).update(id).digest('hex').slice(0, 16);
}
export function generateOgParamsId(params: OgRecord): string {
  const normalized = Object.entries(params)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');

  return createHash('sha256').update(normalized).digest('hex').slice(0, 32);
}
export function verifyOgIdToken(id: string, token: string): boolean {
  const expected = generateOgToken(id);
  // timingSafeEqual prevents timing attacks —
  // comparison always takes the same time regardless of where strings differ
  return timingSafeEqual(Buffer.from(expected, 'utf-8'), Buffer.from(token, 'utf-8'));
}
