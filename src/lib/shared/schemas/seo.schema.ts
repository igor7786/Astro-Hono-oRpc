import { z } from 'zod';

import { envClient } from '@/lib/env/client.env';

export const seoSchema = z.object({
  title: z.string().default('Fast Web Tech'),
  description: z.string().default('My awesome app'),
  author: z.string().optional(),
  date: z.string().default(() => new Date().toISOString()),
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
// Orpc query schema for SEO route
export const seoQuerySchema = z
  .object({
    title: z.string().nonempty('Title must not be empty').default('Fast Web Tech'),
    description: z.string().nonempty('Description must not be empty').default('My awesome app'),
    author: z.string().nonempty('Author must not be empty').default('Alberto'),
    format: z.enum(['webp', 'png']).optional(),
    date: z
      .string()
      .nonempty()
      .default(new Date(2026, 3, 15).toISOString())
      .transform((val) => (val ? formatDate(val) : undefined)),
  })
  .strict();
export type OgParams = z.infer<typeof seoQuerySchema>;
const hex = /^[0-9a-f]+$/;

export const ogIdTokenSchema = z
  .object({
    id: z.string().trim().length(32).regex(hex).default('db28e40583454d1d7c53ad7940395ba6'),
    token: z.string().trim().length(16).regex(hex).default('d6936f591b358e88'),
    format: z.enum(['webp', 'png']).optional(),
  })
  .strip();
export type OgIdToken = z.infer<typeof ogIdTokenSchema>;
