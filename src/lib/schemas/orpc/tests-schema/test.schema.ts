import { z } from 'zod';

export const testSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(200, { message: 'Name must be at most 200 characters long' }),
});

export type TestInput = z.infer<typeof testSchema>;
