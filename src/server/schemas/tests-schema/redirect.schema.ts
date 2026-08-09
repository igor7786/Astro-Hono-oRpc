import { z } from 'zod';

export const redirectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(200, { message: 'Name must be at most 200 characters long' }),
});

export type RedirectInput = z.infer<typeof redirectSchema>;

// ✅ FIXED: Removed the invalid z.object wrapper around the union
export const outputSchema = z.union([
  z.object({
    status: z.literal(200),
    body: redirectSchema,
  }),
  z.object({
    status: z.literal(301),
    headers: z.object({
      location: z.string(),
    }),
  }),
]);

export type RedirectOutput = z.infer<typeof outputSchema>;
