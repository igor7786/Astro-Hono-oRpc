import { z } from 'zod';

const hex = /^[0-9a-f]+$/;
export const ogIdTokenSchema = z
  .object({
    id: z.string().trim().length(32).regex(hex).default('1234567890'),
    format: z.enum(['webp', 'png']).optional(),
  })
  .strip();

export type OgIdToken = z.infer<typeof ogIdTokenSchema>;
export const outputOgSchema = z.object({
  body: z.file(),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
    'X-Cache': z.string(),
    'X-Cache-Tier': z.string(),
  }),
});

export type OutputOgSchema = z.infer<typeof outputOgSchema>;

export const llmsHtmlOutputSchema = z.object({
  body: z.instanceof(Blob),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
  }),
});

export type LlmsHtmlSchema = z.infer<typeof llmsHtmlOutputSchema>;

export const llmsTxtOutputSchema = z.object({
  body: z.file(),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
  }),
});

export type LlmsTxtSchema = z.infer<typeof llmsTxtOutputSchema>;
