import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
