import { z } from 'zod';

/**
 * 1. Input Schema
 * Renamed to clearly indicate it represents the incoming request payload.
 */
export const redirectInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(200, { message: 'Name must be at most 200 characters long' }),
});

export type RedirectInput = z.infer<typeof redirectInputSchema>;

/**
 * 2. Detailed Structure Variants
 * Explicitly named based on their HTTP roles and oRPC's detailed output format.
 */
const successDetailedOutputSchema = z.object({
  status: z.literal(200),
  body: redirectInputSchema, // Reuses the input shape for the response body data
});

const redirectDetailedOutputSchema = z.object({
  status: z.literal(301),
  headers: z.object({
    location: z.string(),
  }),
});

/**
 * 3. Final Combined Output Schema
 */
export const redirectOutputSchema = z.union([successDetailedOutputSchema, redirectDetailedOutputSchema]);

export type RedirectOutput = z.infer<typeof redirectOutputSchema>;
