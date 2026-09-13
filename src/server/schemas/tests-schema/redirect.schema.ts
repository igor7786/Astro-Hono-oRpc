import { z } from 'zod';

export const redirectInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(200, { message: 'Name must be at most 200 characters long' }),
});

export type RedirectInput = z.infer<typeof redirectInputSchema>;

// ✅ FIXED: Removed the invalid z.object wrapper around the union
export const redirectOutputSchema = z.union([
  z.object({
    status: z.literal(200),
    body: redirectInputSchema,
  }),
  z.object({
    status: z.literal(307),
    headers: z.object({
      location: z.string(),
    }),
  }),
]);

export type RedirectOutput = z.infer<typeof redirectOutputSchema>;
