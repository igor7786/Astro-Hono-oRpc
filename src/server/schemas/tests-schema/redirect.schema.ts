import { z } from 'zod';

export const redirectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(200, { message: 'Name must be at most 200 characters long' }),
});

export type RedirectInput = z.infer<typeof redirectSchema>;

export const outputSchema = redirectSchema;

export type RedirectOutput = z.infer<typeof outputSchema>;
