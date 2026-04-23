import { z } from 'zod';

import { envServer } from '@/lib/env/server.env';

export const seoSchema = z.object({
  title: z.string().default('Fast Web Tech'),
  description: z.string().default('My awesome app'),
  author: z.string().optional(),
  date: z.string().default(() => new Date().toISOString()),
  type: z.enum(['website', 'article']).default('website'),
  siteName: z.string().default('Fast Web Tech'),
  siteUrl: z.string().default(envServer.PUBLIC_URL),
  url: z.string().optional(),
});

export type SEO = z.infer<typeof seoSchema>;

export const baseSeo = {
  siteName: 'Fast Web Tech',
  siteUrl: envServer.PUBLIC_URL,
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

export const seoQuerySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  date: z
    .string()
    .optional()
    .transform((val) => (val ? formatDate(val) : undefined)),
});
