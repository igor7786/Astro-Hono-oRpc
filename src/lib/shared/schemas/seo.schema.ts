import { z } from 'zod';

import { envClient } from '@/lib/env/client.env';

export const seoSchema = z.object({
  title: z.string().default('Fast Web Tech'),
  description: z.string().default('My awesome app'),
  author: z.string().optional(),
  date: z.string().default(() => new Date().toISOString()),
  dateModified: z.string().optional(),
  type: z.enum(['website', 'article']).default('website'),
  siteName: z.string().default('Fast Web Tech'),
  siteUrl: z.string().default(envClient.PUBLIC_URL),
  url: z.string().optional(),
});

export type SEO = z.infer<typeof seoSchema>;

export const baseSeo = {
  siteName: 'Fast Web Tech',
  siteUrl: envClient.PUBLIC_URL,
  author: 'Igor',
  type: 'website' as const,
};

export function createSeo(input: Partial<SEO>): SEO {
  return seoSchema.parse({
    ...baseSeo,
    ...input,
  });
}

export function formatDate(date?: string) {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Validates a stored OG record (from SQLite `ogImages` or the fallback
// manifest.json) before it's used to render an image. This is NOT a request
// validator anymore — nothing client-supplied reaches this shape. It's an
// internal integrity check on data you already trust-but-verify.
export const ogRecordSchema = z.object({
  title: z.string().nonempty('Title must not be empty'),
  description: z.string().nonempty('Description must not be empty'),
  author: z.string().nonempty('Author must not be empty').default('Igor'),
  format: z.enum(['webp', 'png']).optional(),
  date: z
    .string()
    .nonempty()
    .transform((val) => formatDate(val)),
});

export type OgRecord = z.infer<typeof ogRecordSchema>;

const hex = /^[0-9a-f]+$/;

// The ONLY thing validated on the incoming public request now: id + optional
// format. `id` gates the SQLite/manifest lookup; there's no token in the URL
// to validate since the image endpoint doesn't trust client-supplied auth —
// existence of `id` in your store IS the authorization.
export const ogIdTokenSchema = z
  .object({
    id: z.string().trim().length(32).regex(hex).default('1234567890'),
    format: z.enum(['webp', 'png']).optional(),
  })
  .strip();

export type OgIdToken = z.infer<typeof ogIdTokenSchema>;
